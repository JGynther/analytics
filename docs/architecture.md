# Design principles

A yet-to-be-named web analytics solution.

### Main design principles:

- Privacy friendly, no-cookies approach
- Fast & lightweight
- Simple, no useless bloat
  - Focus on features that deliver actual value

Performance and UX are the main drivers.

### Cookieless tracking

Privacy is important but so is data-driven decision making for your product.
We can respect a users privacy by distincting users not by identifying but by calculating a hash based on requests made to the collector.
Using information about a user's IP, user-agent, the website they are visting and a random salt, we can make distinctions between users for aggregation but not identify them. 

The salt is changed daily to prevent tracking users accross days. Information about the website itself (projectid) is used to prevent tracking between sites.

This approach has it's downsides but I think making a compromise between good enough data and good UX is important.

## Architecture overview

```mermaid
flowchart
    subgraph user[User flow]
        CDN -...-> script
        Browser{Browsers} <-..-> package[Embedded script / package]
        ---> script[Tracking Script] & events[Custom events]
    end

    subgraph kv[Cloudflare KV]
        salt[Daily salt]
        project[Project data]
    end

    subgraph clickhouse[Clickhouse cluster]
        async[HTTP Async interface] -.- db[(Clickhouse instance)]
    end

    subgraph workers[Cloudflare Workers]
        subgraph ingestion[Ingestion]
            ingest[Ingest worker] -.-
            enrich[Enrichment] -.-
            uid[UID hash]
        end
        ingestion -.- project

        subgraph saltgen[Daily Salt Generator]
            direction RL
            cron[Cron 00:00 UTC] .-> saltworker[Salt worker]
        end
        saltgen --> salt

        subgraph projectflow[Project flow]
            direction TB
            projectworker[Project worker]
        end
    end

    user --> ingestion
    ingestion --> |Queue service?| clickhouse

    subgraph etl[ETL]
        subgraph dbt
            aggregation[Scheduled aggregations]
        end
    end

    subgraph api[Analytics API]
        direction TB
        aggr[Aggregation API]
        views[Views API]
    end

    subgraph next[Nextjs app]
        dashboard[Dashboards]
        blog[Blog]
        marketing[Marketing site]
        login[Login flow]
        signup[Signup flow]
    end

    etl --> api
    clickhouse <--> api
    api <--> dashboard

    subgraph signupflow[Signup flow]
    end

    subgraph postgresql[PostgreSQL]
        database[(PostgreSQL instance)] -.-
        dbapi[Database API]
    end

    projectflow <--> signupflow
    projectflow --> dbapi
    project <--> dbapi
    signupflow -.- signup

    subgraph auth[Authentication API]
    end

    dbapi <--> auth
    auth <--> login
```
### Overview

The project can be split into 4 major components: tracking, collection, OLAP database and aggregation. In addition layers for actual end users like an analytics API and user dashboard are needed. All of the major components work independently of each other following microservice architecture. This allows for switching component design to address issues and bottlenecks can be done efficiently.

```mermaid
flowchart LR
    Tracking ---> Collection ---> db[OLAP Database] 
    Aggregation <---> db <---> ...
```

#### Tracking

Tracking is acomplished with a script either injected into a website using a ready made package or directly embeded. The script automatically tracks pageviews. More features such as tracking file downloads and link clicks could be added, but need to be weighted against performance vs. value provided. The script relies on navigator.sendBeacon for sending asyncronous post requests to not hinder performance.

To track custom events using a package is required. Events are collected in a separate endpoint. Event dimensions and their values can be arbitary.
```mermaid
flowchart LR
    User <---> Website
    script[Tracking script] -..- |Embeded / package| Website
    Website ---> Pageviews
    Website -..-> events[Custom events]
    Pageviews & events ---> ...
```

#### Collection

While the main architecture is based on a serverless design, it is not required. Please see the baseline ExpressJS based base-collector.

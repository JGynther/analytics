type PageViewEvent = {
  path: string;
  projectid?: string | null;
  referrer: string;
};

type Payload = {
  create: (event: PageViewEvent) => void;
  send: () => void;
  value?: Blob;
};

// TODO: is the payload model one to go with?
const payload: Payload = {
  create: (data: PageViewEvent) => {
    payload.value = new Blob([JSON.stringify(data)], { type: 'application/json' });
  },
  send: () => {
    navigator.sendBeacon(`http://localhost:8000/pageview`, payload.value);
  },
};

(function () {
  const location = window.location;
  const document = window.document;
  const script = document.currentScript;
  const projectid = script?.getAttribute('data-projectid');

  function track() {
    payload.create({
      path: location.pathname,
      projectid: projectid,
      referrer: document.referrer,
    });
    payload.send();
  }

  const pushState = window.history.pushState;
  if (pushState) {
    window.history.pushState = function (...args) {
      pushState.call(this, ...args);
      track(); // Call track everytime history is pushed
    };
    window.addEventListener('popstate', track);
  }

  document.addEventListener(
    'visibilitychange',
    () => document.visibilityState === 'visible' && track()
  );

  track(); // Trigger on first page load
})();

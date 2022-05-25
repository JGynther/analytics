// Get current UTC date as yyyy-mm-dd
const getDateStamp = () => new Date().toJSON().split('T')[0];
export default getDateStamp;

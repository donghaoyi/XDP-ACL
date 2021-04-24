let devURL='http://103.29.69.17:6868';
let prodURL = '';
const baseData = {
    URL:(process.env.NODE_ENV==='development')?devURL:prodURL,
    timeInterval:4000
};
export default baseData;
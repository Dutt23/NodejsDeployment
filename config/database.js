if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb://Shatyaki:Shatyak2@ds141611.mlab.com:41611/vidjot-prod"
  };
} else {
    module.exports={
        mongoURI:"mongodb://localhost:27017/vidjot-dev"
    }
}

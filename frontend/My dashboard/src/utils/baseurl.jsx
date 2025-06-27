const baseurl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend.vercel.app"; // replace with actual backend URL

export default baseurl;

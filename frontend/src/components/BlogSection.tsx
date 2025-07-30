const BlogSection = () => {
  const blogs = [
    {
      date: "10 FEB 2023",
      title: "Customer Segmentation and Time Series Forecasting Based on Sales Data",
      author: "Naveen Malla",
      link: "https://medium.com/towards-artificial-intelligence/customer-segmentation-and-time-series-forecasting-based-on-sales-data-b79454071870",
    },
    {
      date: "7 JUN 2023",
      title: "Sales time-series forecasting using a hybrid Prophet — Random Forest machine learning solution",
      author: "Ldicarlo",
      link: "https://medium.com/@ldicarlo1/sales-time-series-forecasting-using-a-hybrid-prophet-random-forest-machine-learning-solution-fe4bdcbea619",
    },
    {
      date: "5 OCT 2023",
      title: "Training Forecasting Models on Multiple Time Series with Darts",
      author: "Julien Herzen",
      link: "https://medium.com/unit8-machine-learning-publication/training-forecasting-models-on-multiple-time-series-with-darts-dc4be70b1844",
    },
  ];

  return (
    <div className="sm:px-6 px-4 py-12 mt-40 mb-65">
      <div className="max-w-7xl max-md:max-w-lg mx-auto">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-slate-900 inline-block">BLOGS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
          {blogs.map((blog, index) => (
            <div key={index} className="cursor-pointer rounded overflow-hidden group">
              <div>
                <span className="text-sm block text-slate-500 mb-2">{blog.date}</span>
                <a 
                  href={blog.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-all">
                    {blog.title}
                  </h3>
                </a>
              </div>

              <hr className="my-5 border-gray-300" />
              <div className="flex flex-wrap items-center gap-3">
                <a href={blog.link} target="_blank" rel="noopener noreferrer">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                </a>
                <p className="text-xs text-slate-500 font-medium">BY {blog.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;

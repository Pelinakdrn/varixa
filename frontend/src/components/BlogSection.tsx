const BlogSection = () => {
    return (
      <div className=" sm:px-6 px-4 py-12 mt-40 mb-65">
        <div className="max-w-7xl max-md:max-w-lg mx-auto">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-900 inline-block">LATEST BLOGS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
            {[
              {
                date: "10 FEB 2023",
                title: "A Guide to Igniting Your Imagination",
                author: "JOHN DOE",
                img: "https://readymadeui.com/team-1.webp",
              },
              {
                date: "7 JUN 2023",
                title: "Hacks to Supercharge Your Day",
                author: "MARK ADAIR",
                img: "https://readymadeui.com/team-2.webp",
              },
              {
                date: "5 OCT 2023",
                title: "Trends and Predictions",
                author: "SIMON KONECKI",
                img: "https://readymadeui.com/team-3.webp",
              },
            ].map((blog, index) => (
              <div key={index} className="cursor-pointer rounded overflow-hidden group">
                <div>
                  <span className="text-sm block text-slate-500 mb-2">{blog.date}</span>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-all">
                    {blog.title}
                  </h3>
                  <div className="mt-4">
                    <p className="text-slate-500 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan, nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula.
                    </p>
                  </div>
                </div>
                <hr className="my-5 border-gray-300" />
                <div className="flex flex-wrap items-center gap-3">
                  <img src={blog.img} className="w-9 h-9 rounded-full" />
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
  
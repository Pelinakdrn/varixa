const ContactSection = () => {
    return (
      <section className="py-16 mt-40 mb-35">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 items-start gap-12 py-12">
            <div>
              <h1 className="text-slate-900 text-3xl font-semibold">Let's Talk</h1>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                You can contact us for ideas aimed at improvement.              </p>
  
              <div className="mt-12">
                <h2 className="text-slate-900 text-base font-semibold">Email</h2>
                <ul className="mt-4">
                  <li className="flex items-center">
                    <div className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#007bff" viewBox="0 0 479.058 479.058">
                        <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                      </svg>
                    </div>
                    <a href="mailto:pelinakduran@gmail.com" className="text-sm ml-4">
                      <small className="block text-slate-900">Mail</small>
                      <span className="text-blue-600 font-medium">pelinakduran@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </div>
  
              <div className="mt-12">
                <h2 className="text-slate-900 text-base font-semibold">Socials</h2>
                <ul className="flex mt-4 space-x-4">
                  <li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#007bff" viewBox="0 0 24 24">
                        <path d="M6.812 13.937H9.33v9.312c0 .414.335.75.75.75l4.007.001a.75.75 0 0 0 .75-.75v-9.312h2.387a.75.75 0 0 0 .744-.657l.498-4a.75.75 0 0 0-.744-.843h-2.885c.113-2.471-.435-3.202 1.172-3.202 1.088-.13 2.804.421 2.804-.75V.909a.75.75 0 0 0-.648-.743A26.926 26.926 0 0 0 15.071 0c-7.01 0-5.567 7.772-5.74 8.437H6.812a.75.75 0 0 0-.75.75v4c0 .414.336.75.75.75z" />
                      </svg>
                    </a>
                  </li>
                  <li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <a href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#007bff" viewBox="0 0 511 512">
                        <path d="M111.898 160.664H15.5c-8.285 0-15 6.719-15 15V497c0 8.285 6.715 15 15 15h96.398c8.286 0 15-6.715 15-15V175.664c0-8.281-6.714-15-15-15zM96.898 482H30.5V190.664h66.398zM63.703 0C28.852 0 .5 28.352.5 63.195c0 34.852 28.352 63.2 63.203 63.2 34.848 0 63.195-28.352 63.195-63.2C126.898 28.352 98.551 0 63.703 0zm0 96.395c-18.308 0-33.203-14.891-33.203-33.2C30.5 44.891 45.395 30 63.703 30c18.305 0 33.195 14.89 33.195 33.195 0 18.309-14.89 33.2-33.195 33.2z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
  
            {/* Sağ form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full text-slate-900 rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-0 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full text-slate-900 rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-0 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full text-slate-900 rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-0 focus:border-blue-500"
              />
              <textarea
                placeholder="Message"
                rows={6}
                className="w-full text-slate-900 rounded-md px-4 border border-gray-300 text-sm pt-2.5 outline-0 focus:border-blue-500"
              ></textarea>
              <button
                type="button"
                className="text-white bg-blue-900 hover:bg-blue-400 rounded-md text-[15px] font-medium px-4 py-2 w-full cursor-pointer !mt-6"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };
  
  export default ContactSection;
  
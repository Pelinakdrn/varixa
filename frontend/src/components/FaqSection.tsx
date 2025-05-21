const faqData = [
  {
    title: "How can I make a prediction?",
    description:
      "To evaluate model performance, go to the prediction section and select a model, product group, and target variable.",
  },
  {
    title: "How can I generate future predictions?",
    description:
      "Select a model, product group, and target variable. The system will generate an 8-week forecast which you can download as an Excel file.",
  },
  {
    title: "How do I log in?",
    description:
      "You can log in using the email and password provided by our team. It is not possible to create an account or change the password manually.",
  },
  {
    title: "Is it secure?",
    description:
      "Yes, all passwords are securely hashed before being stored in our system.",
  },
];

const FaqSection = () => {
  return (
    <div className="bg-white py-16 mt-24 mb-35">
      <div className="max-w-7xl mx-auto px-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-1000 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-10">
          {faqData.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;

import aiImg from "../assets/comp.png";
import dataImg from "../assets/comp.png";
import mlImg from "../assets/comp.png";


const InfoCards = () => {
    const cards = [
      {
        title: "AI Chat Bot",
        description: "Analyze your data with ai chatbot and take insparations.",
        image: aiImg,
      },
      {
        title: "Sales Prediction",
        description: "Upload your data and get predictions.",
        image: dataImg,
      },
      {
        title: "Budget Planning",
        description: "Plan your budget.",
        image: mlImg,
      },
    ];
  
    return (
      <section className="mt-35 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg
"
              >
                <div className="aspect-[3/2] ">
                  <img
                    src={card.image}
                    className="w-full h-full object-cover"
                    alt={`Card image ${index + 1}`}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-slate-900 text-xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default InfoCards;
  
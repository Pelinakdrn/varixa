import forcaste from "../assets/forcaste.png";
import mann from "../assets/mann.png";
import womann from "../assets/womann.png";


const InfoCards = () => {
    const cards = [
      {
        title: "Sales Forecasting for Product Groups",
        description: "Save time and improve your forecasting accuracy by generating separate predictions for each product group.",
        image: womann,
      },
      {
        title: "Seasonal Sales Forecasting",
        description: "Forecast your sales by experimenting with different ML models for your seasonal products.",
        image: forcaste,
      },
      {
        title: "Model Performance Analysis",
        description: "Train your data with different models before making future forecasts and analyze which model performs best.",
        image: mann,
      }
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
  
import member1 from "../assets/pelins.jpg";
import member2 from "../assets/irem.jpg";
import member3 from "../assets/emineg.jpg";
import member4 from "../assets/mehmet.jpg";

const team = [
  { name: "Pelin Akduran", title: "Industrial Engineer", img: member1 },
  { name: "İrem Kaya", title: "Industrial Engineer", img: member2 },
  { name: "Emine Apaydın", title: "Industrial Engineer", img: member3 },
  { name: "Mehmet Uyanık", title: "Industrial Engineer", img: member4 },
];

const TeamSection = () => {
  return (
    <div className="py-16 mt-28 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-slate-900 text-4xl font-bold">Meet our team</h2>
          <p className="text-slate-600 text-sm mt-6 leading-relaxed">
            Our team is dedicated to delivering data-driven solutions with precision, innovation, and a passion for continuous improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="group border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] bg-white"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-48 object-cover bg-gray-200"
              />
              <div className="p-4">
                <h4 className="text-slate-900 text-sm font-semibold">{member.name}</h4>
                <p className="text-slate-600 text-xs mt-1">{member.title}</p>
                <p className="mt-3 text-slate-700 text-xs">
                </p>
                <div className="space-x-2 mt-4">
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                    F
                  </span>
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-sky-400 text-white text-[10px]">
                    T
                  </span>
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#0077b5] text-white text-[10px]">
                    L
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;

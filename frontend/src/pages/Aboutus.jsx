export default function AboutUs() {
  const team = [
    { id: 'CFCC185D6Y2119', name: 'Benedictus Pascal Sanjaya', role: 'Full-Stack Web Developer' },
    { id: 'CFCC185D6Y2818', name: 'Benediktus Geraldi', role: 'Full-Stack Web Developer' },
    { id: 'CDCC185D6Y2675', name: 'Arel Lafito Dinoris', role: 'Data Scientist' },
    { id: 'CDCC185D6Y2746', name: 'Jose Morinho Ngadio', role: 'Data Scientist' },
    { id: 'CACC126D6Y0062', name: 'Farid Rilani Hakim', role: 'AI Engineer' },
    { id: 'CACC126D6Y0053', name: 'Mahendra Agyal Kautsar', role: 'AI Engineer' },
  ];

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          About <span className="text-tosca">Us</span>
        </h1>
        <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
          Tim Capstone Project CC26-PSU102  Coding Camp DBS Foundation × Dicoding 2026.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map(member => (
            <div
              key={member.id}
              className="bg-nutri-card border border-white/5 rounded-2xl p-6 hover:border-tosca/40 hover:shadow-glow-sm transition"
            >
              <div className="w-16 h-16 rounded-full bg-tosca/20 flex items-center justify-center text-tosca text-2xl font-bold mb-3">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-white font-bold">{member.name}</h3>
              <p className="text-tosca text-sm">{member.role}</p>
              <p className="text-white/40 text-xs mt-2">{member.id}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
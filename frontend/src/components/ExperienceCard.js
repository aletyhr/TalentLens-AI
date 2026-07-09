function ExperienceCard({ experience }) {
  return (
    <div className="card shadow p-3 mb-4">
      <h3>💼 Experience</h3>

      <ul>
        {experience.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExperienceCard;

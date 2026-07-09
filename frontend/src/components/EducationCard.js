function EducationCard({ education }) {
  return (
    <div className="card shadow p-3 mb-4">
      <h3>🎓 Education</h3>

      <ul>
        {education.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default EducationCard;

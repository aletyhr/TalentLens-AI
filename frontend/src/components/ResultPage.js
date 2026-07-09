import ATSCard from "./ATSCard";
import SkillsCard from "./SkillsCard";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import SuggestionCard from "./SuggestionCard";

function ResultPage({
  atsScore,
  skills,
  education,
  experience,
  suggestions,
  matchedSkills,
  missingSkills,
}) {
  return (
    <div className="container mt-5">
      <ATSCard score={atsScore} />

      <SkillsCard skills={skills} />

      <EducationCard education={education} />

      <ExperienceCard experience={experience} />

      <div className="card shadow p-3 mb-4">
        <h3>✅ Matched Skills</h3>

        <ul>
          {matchedSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="card shadow p-3 mb-4">
        <h3>❌ Missing Skills</h3>

        <ul>
          {missingSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <SuggestionCard suggestions={suggestions} />
    </div>
  );
}

export default ResultPage;

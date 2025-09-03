import React from 'react';

const GradeDistribution = ({ analytics }) => {
  return (
    <div className="analytics-card">
      <h3>Grade Distribution</h3>
      <div className="grade-stats">
        <div className="grade-metric">
          <span className="grade-label">A Grades:</span>
          <span className="grade-value a-grade">{analytics.aGrades}</span>
          <span className="grade-percentage">
            ({analytics.totalTrades > 0 ? ((analytics.aGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
          </span>
        </div>
        <div className="grade-metric">
          <span className="grade-label">B Grades:</span>
          <span className="grade-value b-grade">{analytics.bGrades}</span>
          <span className="grade-percentage">
            ({analytics.totalTrades > 0 ? ((analytics.bGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
          </span>
        </div>
        <div className="grade-metric">
          <span className="grade-label">C Grades:</span>
          <span className="grade-value c-grade">{analytics.cGrades}</span>
          <span className="grade-percentage">
            ({analytics.totalTrades > 0 ? ((analytics.cGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
          </span>
        </div>
        <div className="grade-metric">
          <span className="grade-label">D Grades:</span>
          <span className="grade-value d-grade">{analytics.dGrades}</span>
          <span className="grade-percentage">
            ({analytics.totalTrades > 0 ? ((analytics.dGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
          </span>
        </div>
        <div className="grade-metric">
          <span className="grade-label">No Grade:</span>
          <span className="grade-value no-grade">{analytics.noGrades}</span>
          <span className="grade-percentage">
            ({analytics.totalTrades > 0 ? ((analytics.noGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
          </span>
        </div>
      </div>
      <div className="grade-summary">
        <div className="summary-item">
          <span className="summary-label">Graded Trades:</span>
          <span className="summary-value">{analytics.totalGradedTrades}/{analytics.totalTrades}</span>
        </div>
      </div>
    </div>
  );
};

export default GradeDistribution;

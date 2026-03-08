import { QUESTION_DATABASE } from './services/exerciseGenerator';
import alasql from 'alasql';
import { runQuery, initDatabase } from './services/sqlService';
import { TopicId, Difficulty } from './types';
import fs from 'fs';

async function validate() {
  initDatabase(Difficulty.Medium);

  let totalExercises = 0;
  const issues: any[] = [];

  for (const topic of Object.values(TopicId)) {
    for (const difficulty of Object.values(Difficulty)) {
      const exercises = QUESTION_DATABASE[topic as string]?.[difficulty as string] || [];
      totalExercises += exercises.length;

      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        
        let testQuery = ex.queryTemplate;
        if (ex.replacements) {
            Object.entries(ex.replacements).forEach(([key, values]) => {
                const replacement = String(values[0]);
                const regex = new RegExp(`{${key}}`, "g");
                testQuery = testQuery.replace(regex, replacement);
            });
        }

        const result = runQuery(testQuery);

        if (!result.success) {
            issues.push({
                type: 'ERROR',
                topic, difficulty, index: i,
                title: ex.titleTemplate,
                query: testQuery,
                error: result.error
            });
        } else if (!result.data || result.data.length === 0) {
            if (testQuery.toUpperCase().startsWith("SELECT") || testQuery.toUpperCase().startsWith("(SELECT")) {
                issues.push({
                    type: 'WARNING',
                    topic, difficulty, index: i,
                    title: ex.titleTemplate,
                    query: testQuery,
                    error: 'Empty Output'
                });
            }
        }
      }
    }
  }

  fs.writeFileSync('errors.json', JSON.stringify({
      total: totalExercises,
      issuesCount: issues.length,
      issues
  }, null, 2));

  console.log(`Saved ${issues.length} issues to errors.json`);
}

validate().catch(console.error);

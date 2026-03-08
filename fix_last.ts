import fs from 'fs';

let content = fs.readFileSync('services/exerciseGenerator.ts', 'utf-8');

const oldStr = "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) as avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE (e.manager_id IS NULL OR e.manager_id = 'NULL') AND e.salary < d_avg.avg_sal";
const newStr = "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) as avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE e.salary > d_avg.avg_sal";

content = content.replace(oldStr, newStr);

fs.writeFileSync('services/exerciseGenerator.ts', content);

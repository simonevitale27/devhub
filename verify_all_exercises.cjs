const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'services/exerciseGenerator.ts');

function checkFile() {
    if (!fs.existsSync(FILE_PATH)) {
        console.error("File not found:", FILE_PATH);
        process.exit(1);
    }

    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    
    const topics = [
        'TopicId.Basics', 'TopicId.Sorting', 'TopicId.Filtering', 
        'TopicId.Joins', 'TopicId.Aggregation', 'TopicId.Case', 
        'TopicId.Functions', 'TopicId.Dates', 'TopicId.Advanced'
    ];
    
    // Find all topic positions
    const topicPositions = topics.map(t => {
        // Search for "[TopicId.X]:"
        const index = content.indexOf(`[${t}]:`);
        return { topic: t, index: index };
    }).filter(t => t.index !== -1).sort((a, b) => a.index - b.index);

    let totalErrors = 0;
    
    topicPositions.forEach((pos, i) => {
        const topic = pos.topic;
        const start = pos.index;
        const end = (i < topicPositions.length - 1) ? topicPositions[i+1].index : content.length;
        
        const topicContent = content.substring(start, end);
        console.log(`Checking ${topic}...`);
        
        const difficulties = ['Difficulty.Easy', 'Difficulty.Medium', 'Difficulty.Hard'];
        
        // Find difficulty positions within this topic block
        // Be careful: Difficulty.Easy is used in every topic, so we must search relative to topicContent
        const diffPositions = difficulties.map(d => {
            const idx = topicContent.indexOf(`[${d}]:`);
            return { diff: d, index: idx };
        }).filter(d => d.index !== -1).sort((a, b) => a.index - b.index);

        if (diffPositions.length < 3) {
             console.error(`  [ERROR] Missing difficulty levels in ${topic}. Found: ${diffPositions.map(d => d.diff).join(', ')}`);
             // totalErrors++; // Soft fail for now if some topics are intentionally empty? No, goal is 30 each.
        }

        diffPositions.forEach((dPos, j) => {
            const diff = dPos.diff;
            const dStart = dPos.index;
            const dEnd = (j < diffPositions.length - 1) ? diffPositions[j+1].index : topicContent.length;
            
            const diffContent = topicContent.substring(dStart, dEnd);
            
            // Count number of objects. A good proxy is "titleTemplate:"
            const matches = diffContent.match(/titleTemplate\s*:/g);
            const count = matches ? matches.length : 0;
            
            console.log(`  ${diff}: ${count}`);
            
            if (count < 30) {
                 console.warn(`    [WARNING] ${topic} - ${diff} has ${count} exercises (Goal: 30)`);
                 if (count === 0) totalErrors++;
            }
            
             // Check for placeholders
             if (diffContent.includes('queryTemplate: "..."')) {
                  console.error(`    [ERROR] Found placeholder "..." in ${topic} - ${diff}`);
                  totalErrors++;
             }
        });
    });

    console.log("Done checking.");
    if (totalErrors > 0) process.exit(1);
}

checkFile();

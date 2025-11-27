
const fs = require('fs');
const content = fs.readFileSync('/Users/simonevitale/Desktop/DEV HUB/sql-gym/services/exerciseGenerator.ts', 'utf8');

// Regex to find topics
const topicRegex = /\[TopicId\.(\w+)\]:\s*\{/g;
const difficultyRegex = /\[Difficulty\.(\w+)\]:\s*\[/g;
const exerciseRegex = /titleTemplate:/g;

let match;
const topics = [];

// Naive parsing: split by TopicId, then by Difficulty
const topicSplits = content.split('[TopicId.');
// Remove first chunk (imports etc)
topicSplits.shift();

topicSplits.forEach(chunk => {
    // Extract topic name
    const topicNameMatch = chunk.match(/^(\w+)\]:/);
    if (!topicNameMatch) return;
    const topicName = topicNameMatch[1];

    console.log(`\nTOPIC: ${topicName}`);

    const diffSplits = chunk.split('[Difficulty.');
    diffSplits.shift(); // Remove content before first difficulty

    diffSplits.forEach(diffChunk => {
        const diffNameMatch = diffChunk.match(/^(\w+)\]:/);
        if (!diffNameMatch) return;
        const diffName = diffNameMatch[1];

        // Count exercises in this chunk (until next difficulty or end of topic)
        // We need to be careful not to count exercises from next chunks if we didn't split perfectly
        // But splitting by [Difficulty. should separate them well enough for counting

        // Actually, let's just count occurrences of "titleTemplate" in this chunk
        // But wait, the chunk might contain the *next* topic if I'm not careful.
        // The split by TopicId handles the topic separation.

        // We need to stop at the end of the difficulty block.
        // But since we split by [Difficulty.X], the chunk goes until the next difficulty or end of string.
        // This should be fine.

        const count = (diffChunk.match(/titleTemplate:/g) || []).length;
        console.log(`  - ${diffName}: ${count}`);
    });
});

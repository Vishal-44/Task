// Helper function to calculate distance between two points, considering intermediate stops
const { warehouses, distances, costTable } = require('./data.js');

function getDistance(from, to, visited = []) {
    if (from === to) {
        return 0;
    }
    visited.push(from);
    let minDistance = Infinity;

    for (const neighbor in distances[from]) {
        if (!visited.includes(neighbor)) {
            const distance = distances[from][neighbor] + getDistance(neighbor, to, [...visited]);
            minDistance = Math.min(minDistance, distance);
        }
    }
    return minDistance;
}

// Helper function to calculate the cost based on weight and distance
function calculateCost(totalWeight, totalDistance) {
    let costPerUnit = 0;
    for (const tier of costTable) {
        if (totalWeight <= tier.weight) {
            costPerUnit = tier.costPerUnitDistance;
            break;
        }
    }
    return costPerUnit * totalDistance;
}

module.exports = { calculateCost, getDistance };
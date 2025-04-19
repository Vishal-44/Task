const warehouses = [
    { center: 'C1', product: 'A', weight: 3 },
    { center: 'C1', product: 'B', weight: 2 },
    { center: 'C1', product: 'C', weight: 8 },
    { center: 'C2', product: 'D', weight: 12 },
    { center: 'C2', product: 'E', weight: 25 },
    { center: 'C2', product: 'F', weight: 15 },
    { center: 'C3', product: 'G', weight: 0.5 },
    { center: 'C3', product: 'H', weight: 1 },
    { center: 'C3', product: 'I', weight: 2 },
];

// Distances between locations
const distances = {
    C1: { L1: 4, C2: 2.5, C3: Infinity }, // Infinity as there's no direct path shown
    C2: { L1: 2, C1: 2.5, C3: 3 },
    C3: { L1: 2, C1: Infinity, C2: 3 }, // Infinity as there's no direct path shown
};

// Cost per unit distance based on total weight (in kgs)
const costTable = [
    { weight: 5, costPerUnitDistance: 10 },
    { weight: Infinity, costPerUnitDistance: 8 }, // 'Ever additional 5 kgs' implies anything over 5kg
];

module.exports = { warehouses, distances, costTable };
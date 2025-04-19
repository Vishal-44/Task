const { warehouses } = require('./data.js')
const { calculateCost, getDistance } = require('./utils')

exports.minimumCost = async (req, res) => {
    try{
        const  order  = req.body
        // console.log(order)
        if (!order || Object.keys(order).length === 0) {
            return res.status(400).json({ error: 'Order details are required.' });
        }
    
        const requiredProducts = {};
    let totalOrderWeight = 0;
    for (const productCode in order) {
        const quantity = order[productCode];
        const productInfo = warehouses.find(item => item.product === productCode);
        if (!productInfo) {
            return res.status(400).json({ error: `Product "${productCode}" not found.` });
        }
        requiredProducts[productCode] = { quantity: quantity, weightPerUnit: productInfo.weight };
        totalOrderWeight += productInfo.weight * quantity;
    }

    const fulfillingCenters = {};
    for (const productCode in requiredProducts) {
        // console.log(typeof(productCode), productCode)
        fulfillingCenters[productCode] = new Set(
            warehouses
                .filter(w => w.product === productCode && w.weight * requiredProducts[productCode].quantity <= warehouses.filter(ww => ww.center === w.center && ww.product === productCode).reduce((sum, item) => sum + item.weight, 0))
                .map(w => w.center)
        );
        if (fulfillingCenters[productCode].size === 0) {
            return res.status(400).json({ error: `Product "${productCode}" cannot be fulfilled.` });
        }
    }

    // Find a minimal set of centers that can fulfill all products
    // This is a simplified approach - a more robust solution might involve more complex set cover algorithms
    const uniqueCentersNeeded = new Set();
    for (const productCode in fulfillingCenters) {
        fulfillingCenters[productCode].forEach(center => uniqueCentersNeeded.add(center));
    }
    const centersToVisit = Array.from(uniqueCentersNeeded);

    let minCost = Infinity;
    const possibleRoutes = [];

    // If only one center is needed, calculate direct cost
    if (centersToVisit.length === 1) {
        const center = centersToVisit[0];
        const distance = getDistance(center, 'L1');
        const cost = calculateCost(totalOrderWeight, distance);
        if (cost < minCost) {
            minCost = cost;
            possibleRoutes.push({ route: [center, 'L1'], cost: cost });
        }
    } else if (centersToVisit.length > 1) {
        // Need to explore routes visiting all centers and then L1
        // This is a simplified approach that considers starting from each center
        centersToVisit.forEach(startCenter => {
            const otherCenters = centersToVisit.filter(c => c !== startCenter);
            // For simplicity, we'll just calculate the cost of a direct sequence: start -> ...otherCenters -> L1
            let currentDistance = getDistance(startCenter, otherCenters[0] || 'L1'); // If only one, go to L1
            let currentRoute = [startCenter];
            let lastStop = startCenter;

            otherCenters.forEach(center => {
                currentDistance += getDistance(lastStop, center);
                currentRoute.push(center);
                lastStop = center;
            });
            currentDistance += getDistance(lastStop, 'L1');
            currentRoute.push('L1');
            const cost = calculateCost(totalOrderWeight, currentDistance);

            if (cost < minCost) {
                minCost = cost;
                possibleRoutes.length = 0;
                possibleRoutes.push({ route: currentRoute, cost: cost });
            } else if (cost === minCost) {
                possibleRoutes.push({ route: currentRoute, cost: cost });
            }
        });
    }

    if (minCost === Infinity && Object.keys(order).length > 0) {
        return res.status(400).json({ error: 'Could not fulfill the order from the available centers.' });
    } else if (Object.keys(order).length === 0) {
        return res.json({ minimumDeliveryCost: 0, route: ['L1'] });
    }

    res.json({ minimumDeliveryCost: minCost });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg :"Internal Server Error"})
    }
}
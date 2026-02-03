export function calculateTrend(data: number[]): {
    percentageChange: number;
    direction: 'up' | 'down' | 'stable';
    color: string;
} {
    if (!data || data.length < 2) {
        return { percentageChange: 0, direction: 'stable', color: '#6B7280' };
    }
    
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    
    const change = lastValue - firstValue;
    const percentageChange = (change / firstValue) * 100;
    
    let direction: 'up' | 'down' | 'stable';
    let color: string;
    
    if (Math.abs(percentageChange) < 0.5) {
        direction = 'stable';
        color = '#ff9249'; // orange
    } else if (percentageChange > 0) {
        direction = 'up';
        color = '#10B981'; // green
    } else {
        direction = 'down';
        color = '#EF4444'; // red
    }
    
    return {
        percentageChange: Math.abs(percentageChange),
        direction,
        color
    }
}
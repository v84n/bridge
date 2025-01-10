import { supabase } from './config.js';

// Initialize chart variables
let watchChart, featureChart, timelineChart;

// Chart.js theme configuration
function getChartConfig(theme) {
    return {
        color: theme === 'dark' ? '#F5F5F7' : '#1D1D1F',
        borderColor: theme === 'dark' ? '#F5F5F7' : '#1D1D1F',
        grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
    };
}

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    if (watchChart && featureChart && timelineChart) {
        updateChartsTheme(theme);
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Initialize charts
function initCharts(theme) {
    const chartConfig = getChartConfig(theme);

    // Watch Model Distribution Chart
    const watchCtx = document.getElementById('watchChart').getContext('2d');
    watchChart = new Chart(watchCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#007AFF',
                    '#5856D6',
                    '#FF2D55',
                    '#FF9500'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartConfig.color
                    }
                }
            }
        }
    });

    // Feature Priorities Chart
    const featureCtx = document.getElementById('featureChart').getContext('2d');
    featureChart = new Chart(featureCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: '#007AFF'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartConfig.color
                    },
                    grid: {
                        color: chartConfig.grid.color
                    }
                },
                x: {
                    ticks: {
                        color: chartConfig.color
                    },
                    grid: {
                        color: chartConfig.grid.color
                    }
                }
            }
        }
    });

    // Timeline Chart
    const timelineCtx = document.getElementById('timelineChart').getContext('2d');
    timelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Submissions',
                data: [],
                borderColor: '#007AFF',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartConfig.color
                    },
                    grid: {
                        color: chartConfig.grid.color
                    }
                },
                x: {
                    ticks: {
                        color: chartConfig.color
                    },
                    grid: {
                        color: chartConfig.grid.color
                    }
                }
            }
        }
    });
}

function updateChartsTheme(theme) {
    const chartConfig = getChartConfig(theme);
    
    [watchChart, featureChart, timelineChart].forEach(chart => {
        if (chart) {
            // Update scales
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    scale.ticks.color = chartConfig.color;
                    scale.grid.color = chartConfig.grid.color;
                });
            }
            // Update legend
            if (chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = chartConfig.color;
            }
            chart.update();
        }
    });
}

// Data fetching and processing
async function fetchData() {
    try {
        console.log('Fetching data from Supabase...');
        const { data, error } = await supabase
            .from('interest_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!data) {
            console.warn('No data received from Supabase');
            return;
        }

        console.log('Received data:', data);
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('totalSubmissions').textContent = 'Error';
        document.getElementById('last24Hours').textContent = 'Error';
        document.getElementById('topWatch').textContent = 'Error';
        document.getElementById('topFeature').textContent = 'Error';
    }
}

function updateDashboard(data) {
    // Update stats
    document.getElementById('totalSubmissions').textContent = data.length;
    
    const last24Hours = data.filter(item => {
        return new Date(item.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    }).length;
    document.getElementById('last24Hours').textContent = last24Hours;

    // Process watch model data
    const watchCounts = data.reduce((acc, item) => {
        acc[item.watch_model] = (acc[item.watch_model] || 0) + 1;
        return acc;
    }, {});
    
    // Update watch chart
    watchChart.data.labels = Object.keys(watchCounts);
    watchChart.data.datasets[0].data = Object.values(watchCounts);
    watchChart.update();

    // Process feature data
    const featureCounts = data.reduce((acc, item) => {
        acc[item.top_feature] = (acc[item.top_feature] || 0) + 1;
        return acc;
    }, {});
    
    // Update feature chart
    featureChart.data.labels = Object.keys(featureCounts);
    featureChart.data.datasets[0].data = Object.values(featureCounts);
    featureChart.update();

    // Process timeline data
    const timelineData = data.reduce((acc, item) => {
        const date = new Date(item.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    
    // Update timeline chart
    timelineChart.data.labels = Object.keys(timelineData);
    timelineChart.data.datasets[0].data = Object.values(timelineData);
    timelineChart.update();

    // Update top stats
    const topWatch = Object.entries(watchCounts).sort((a, b) => b[1] - a[1])[0];
    const topFeature = Object.entries(featureCounts).sort((a, b) => b[1] - a[1])[0];
    
    document.getElementById('topWatch').textContent = topWatch ? topWatch[0] : '-';
    document.getElementById('topFeature').textContent = topFeature ? topFeature[0] : '-';
}

// Initialize everything in the correct order
document.addEventListener('DOMContentLoaded', () => {
    // First initialize charts
    initCharts(localStorage.getItem('theme') || 'light');
    
    // Then set up theme handling
    initTheme();
    
    // Set up theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Fetch initial data
    fetchData();
    
    // Refresh data every 30 seconds
    setInterval(fetchData, 30000);
}); 
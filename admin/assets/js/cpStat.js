    async function fetchStats() {
      
        const { data: totalCPs, error: totalCPError } = await _supabase
            .from('collection_point')
            .select('*');
        document.getElementById('total-collection-points').textContent = totalCPs.length;

    
        const { data: latestHistory, error: historyError } = await _supabase
            .from('history')
            .select('*')
            .order('created_at', { ascending: false });

    
        const latestStatuses = {};
        latestHistory.forEach(item => {
            latestStatuses[item.cp_name] = item.status; 
        });

       
        const fullCount = Object.values(latestStatuses).filter(status => status === 'full').length;
        const emptiedCount = Object.values(latestStatuses).filter(status => status === 'emptied').length;

        document.getElementById('full-collection-points').textContent = fullCount;
        document.getElementById('available-collection-points').textContent = emptiedCount;

        // Reports Today
        const today = new Date().toISOString().split('T')[0]; 
        const { data: reportsToday, error: reportsTodayError } = await _supabase
            .from('userfeedback')
            .select('*')
            .gte('created_at', `${today}T00:00:00.000Z`)
            .lte('created_at', `${today}T23:59:59.999Z`);
        document.getElementById('reports-today').textContent = reportsToday.length;
    }

    // Fetch stats on page load
    fetchStats();
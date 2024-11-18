
async function fetchLogs() {
    try {
        const selectedRange = document.getElementById('date-range').value;
        let startDate = new Date();

        switch (selectedRange) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                const day = startDate.getDay();
                const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
                startDate.setDate(diff);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'year':
                startDate = new Date(startDate.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                break;
        }

        const isoDate = startDate.toISOString();

        const { data: logs, error: logError } = await _supabase
            .from('history')
            .select('*')
            .gte('created_at', isoDate)
            .order('created_at', { ascending: false });

        if (logError) {
            console.error("Error fetching logs:", logError.message);
            return;
        }


        const { data: collectionPoints, error: cpError } = await _supabase
            .from('collection_point')
            .select('*');

        if (cpError) {
            console.error("Error fetching collection points:", cpError.message);
            return;
        }

        const cpMap = {};
        collectionPoints.forEach(cp => {
            cpMap[cp.cp_name] = cp;
        });


        const { data: collectors, error: collectorError } = await _supabase
            .from('collector')
            .select('*');

        if (collectorError) {
            console.error("Error fetching collectors:", collectorError.message);
            return;
        }

    
        const collectorMap = {};
        collectors.forEach(collector => {
            if (collector.collection_points) {
                collector.collection_points.forEach(point => {
                    if (!collectorMap[point.cp_id]) {
                        collectorMap[point.cp_id] = [];
                    }
                    point.schedule.forEach(day => {
                        collectorMap[point.cp_id].push({
                            name: collector.name,
                            day: day
                        });
                    });
                });
            }
        });

        if (logs && logs.length > 0) {
            const logsHtml = logs.map(log => {
                const logDate = new Date(log.created_at);
                const logDay = logDate.toLocaleString('en-US', { weekday: 'long' });
                const cpInfo = cpMap[log.cp_name];
                
   
                const cpId = cpInfo?.id?.toString();
                
 
                const assignedCollector = cpId ? collectorMap[cpId]?.find(c => c.day === logDay) : null;

                return `
                    <tr>
                        <td class="cell">${log.cp_name || 'N/A'}</td>
                        <td class="cell"><span class="truncate">${cpInfo?.cp_address || 'N/A'}</span></td>
                        <td class="cell"><a href="${log.image_url}" target="_blank">VIEW</a></td>
                        <td class="cell"><span>${logDate.toLocaleDateString()}</span>
                        <span class="note">${logDate.toLocaleTimeString()}</span></td>
                        <td class="cell"><span class="badge ${log.status === 'emptied' ? 'bg-success' : 'bg-danger'}">${log.status}</span></td>
                    </tr>
                `;
            }).join('');

            document.querySelector('tbody').innerHTML = logsHtml;
        } else {
            document.querySelector('tbody').innerHTML = '<tr><td colspan="6">No logs found</td></tr>';
        }
    } catch (err) {
        console.error("Error in fetchLogs:", err);
    }
}

document.getElementById('date-range').addEventListener('change', fetchLogs);

fetchLogs();

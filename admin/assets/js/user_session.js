    
const { createClient } = supabase;
const _supabase = createClient('https://uiciowpyxfawjvaddivu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpY2lvd3B5eGZhd2p2YWRkaXZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzE0MDQyMCwiZXhwIjoyMDQyNzE2NDIwfQ.kR8PsVyqtW0QTJoFjFq6aiXU-iq0y3alXfJQIRMVgBw', {
auth: {
          autoRefreshToken: true, 
          persistSession: true    
      }
});
    
    document.addEventListener('DOMContentLoaded', async function() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = '../index.html'; 
    }else{
        console.log(session);
    }
    
    /*else {
        // Session check
        const userId = session.user.id;
        const { data: userRoles, error: roleError } = await _supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (roleError) {
            console.error('Error fetching user role:', roleError.message);
            alert('Failed to fetch user role.');
            return;
        }

        const userRole = userRoles.role;

        if (userRole === 'collector') {
            // Load collector-specific content
            loadCollectorDashboard();
        }else {
            window.location.href = '../index.html'; 
        }
    }*/
});
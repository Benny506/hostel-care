import { supabase } from "../../supabase/supabaseClient"


export const complaintService = {
    /**
     * Submit a new maintenance complaint.
     * @param {object} complaintData 
     */
    createComplaint: async (complaintData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Unauthenticated: Access denied.')

            const { data, error } = await supabase
                .from('hc_complaints')
                .insert({
                    ...complaintData,
                    student_id: user.id,
                    status: 'pending'
                })
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error creating complaint:', error)
            throw new Error(error.message || 'Failed to submit maintenance request.')
        }
    },

    /**
     * Fetch all complaints for the current student.
     */
    getMyComplaints: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Unauthenticated session.')

            const { data, error } = await supabase
                .from('hc_complaints')
                .select(`
                *,
                warden:warden_id(full_name)
            `)
                .eq('student_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching complaints:', error)
            throw new Error('Error: Failed to load your requests.')
        }
    },

    /**
     * Fetch recent institutional announcements.
     */
    getAnnouncements: async (limit = 5) => {
        try {
            const { data, error } = await supabase
                .from('hc_announcements')
                .select(`
                *,
                warden:warden_id(full_name)
            `)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching announcements:', error)
            throw new Error('Database unreachable.')
        }
    },

    /**
     * Get statistics for the current student's dashboard.
     */
    getStudentStats: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const { data: complaints, error } = await supabase
                .from('hc_complaints')
                .select('status')
                .eq('student_id', user.id)

            if (error) throw error

            return {
                total: complaints.length,
                pending: complaints.filter(c => c.status === 'pending').length,
                resolved: complaints.filter(c => c.status === 'resolved').length,
                inProgress: complaints.filter(c => c.status === 'in-progress').length
            }
        } catch (error) {
            console.error('Error fetching student stats:', error)
            return { total: 0, pending: 0, resolved: 0, inProgress: 0 }
        }
    },

    /**
     * Warden: Fetch all student maintenance requests.
     */
    getAllComplaints: async () => {
        try {
            const { data, error } = await supabase
                .from('hc_complaints')
                .select(`
                    *,
                    student:student_id(full_name, room_number)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Warden Error: Failed to retrieve requests.', error)
            throw new Error('Database unreachable.')
        }
    },

    /**
     * Warden: Update the status of a specific complaint.
     */
    updateComplaintStatus: async (id, status) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('hc_complaints')
                .update({ status, warden_id: user.id })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Warden Error: Status update failed.', error)
            throw new Error('Error: Failed to update status.')
        }
    },

    /**
     * Warden: Get global statistics.
     */
    getWardenStats: async () => {
        try {
            const { data: complaints, error } = await supabase
                .from('hc_complaints')
                .select('status')

            if (error) throw error

            return {
                total: complaints.length,
                pending: complaints.filter(c => c.status === 'pending').length,
                resolved: complaints.filter(c => c.status === 'resolved').length,
                inProgress: complaints.filter(c => c.status === 'in-progress').length
            }
        } catch (error) {
            console.error('Warden Error: Failed to aggregate global stats.', error)
            return { total: 0, pending: 0, resolved: 0, inProgress: 0 }
        }
    },

    /**
     * Warden: Post a new announcement.
     */
    createAnnouncement: async (announceData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('hc_announcements')
                .insert({
                    ...announceData,
                    warden_id: user.id
                })
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Warden Error: Failed to post announcement.', error)
            throw new Error('Error: Failed to publish announcement.')
        }
    },

    /**
     * Warden: Fetch all student profiles for the directory.
     */
    getAllStudents: async () => {
        try {
            const { data: students, error } = await supabase
                .from('hc_profiles')
                .select('*')
                .eq('role', 'student')
                .order('full_name', { ascending: true })

            if (error) throw error
            return students
        } catch (error) {
            console.error('Warden Error: Failed to retrieve student directory.', error)
            throw new Error('Database unreachable.')
        }
    },

    /**
     * Warden: Fetch all maintenance requests for a specific student.
     * @param {string} studentId 
     */
    getStudentComplaints: async (studentId) => {
        try {
            const { data, error } = await supabase
                .from('hc_complaints')
                .select('*')
                .eq('student_id', studentId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Warden Error: Failed to fetch student request history.', error)
            throw new Error('Error: Failed to load student history.')
        }
    }
}

export default complaintService

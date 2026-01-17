/**
 * DataBridgeDB - Client-Side Mock Database using localStorage
 */
class DataBridgeDB {
    constructor() {
        this.init();
    }

    init() {
        // Seed Jobs if empty
        if (!localStorage.getItem('db_jobs')) {
            const seedJobs = [
                {
                    id: 1,
                    title: "Senior XML Specialist",
                    category: "engineering",
                    type: "Full Time",
                    location: "Remote / Hybrid",
                    description: "Lead complex data conversion projects. Mastery of DTD, XSLT, and Schema development is required. Join our elite tech team."
                },
                {
                    id: 2,
                    title: "Data Quality Analyst",
                    category: "operations",
                    type: "Full Time",
                    location: "Remote / Hybrid",
                    description: "Ensure the accuracy and integrity of large-scale datasets. Validate data against strict quality standards in a fast-paced environment."
                },
                {
                    id: 3,
                    title: "Business Development Manager",
                    category: "sales",
                    type: "Full Time",
                    location: "Hyderabad",
                    description: "Drive growth by identifying new business opportunities in the BPO and data services sector. Proven track record in IT sales required."
                },
                {
                    id: 4,
                    title: "Banking Process Associate",
                    category: "banking",
                    type: "Full Time",
                    location: "Hyderabad",
                    description: "Handle back-office banking operations, loan processing, and document verification. Experience in financial services is preferred."
                }
            ];
            localStorage.setItem('db_jobs', JSON.stringify(seedJobs));
        }

        // Initialize Applications & Messages if empty
        if (!localStorage.getItem('db_applications')) {
            localStorage.setItem('db_applications', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_messages')) {
            localStorage.setItem('db_messages', JSON.stringify([]));
        }
    }

    // --- JOBS ---
    getJobs() {
        return JSON.parse(localStorage.getItem('db_jobs'));
    }

    addJob(job) {
        const jobs = this.getJobs();
        job.id = Date.now(); // Simple ID generation
        jobs.push(job);
        localStorage.setItem('db_jobs', JSON.stringify(jobs));
        return job;
    }

    deleteJob(id) {
        let jobs = this.getJobs();
        jobs = jobs.filter(job => job.id != id);
        localStorage.setItem('db_jobs', JSON.stringify(jobs));
    }

    // --- APPLICATIONS ---
    getApplications() {
        return JSON.parse(localStorage.getItem('db_applications'));
    }

    saveApplication(application) {
        const apps = this.getApplications();
        application.id = Date.now();
        application.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
        apps.unshift(application); // Add to top
        localStorage.setItem('db_applications', JSON.stringify(apps));
    }

    // --- MESSAGES ---
    getMessages() {
        return JSON.parse(localStorage.getItem('db_messages'));
    }

    saveMessage(message) {
        const msgs = this.getMessages();
        message.id = Date.now();
        message.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
        msgs.unshift(message);
        localStorage.setItem('db_messages', JSON.stringify(msgs));
    }

    deleteMessage(id) {
        let msgs = this.getMessages();
        msgs = msgs.filter(msg => msg.id != id);
        localStorage.setItem('db_messages', JSON.stringify(msgs));
    }

    // --- STATS ---
    getStats() {
        const jobs = this.getJobs();
        const apps = this.getApplications();
        const msgs = this.getMessages();
        return {
            totalJobs: jobs.length,
            totalApplications: apps.length,
            totalMessages: msgs.length,
            recentActivity: [...apps.map(a => ({...a, type: 'Application'})), ...msgs.map(m => ({...m, type: 'Message'}))]
                .sort((a, b) => b.id - a.id)
                .slice(0, 5)
        };
    }
}

// Export instance
window.db = new DataBridgeDB();

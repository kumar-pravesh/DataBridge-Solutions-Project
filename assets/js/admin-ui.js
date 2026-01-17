/**
 * Admin UI Manager - Handles Dashboard Interactions
 */

// --- TABS & NAVIGATION ---
function switchTab(tabName) {
    // Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.innerText.toLowerCase().includes(tabName)) {
            btn.classList.add('text-primary', 'bg-primary/10');
            btn.classList.remove('text-gray-500', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-white/5');
        } else {
            btn.classList.remove('text-primary', 'bg-primary/10');
            btn.classList.add('text-gray-500', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-white/5');
        }
    });

    const content = document.getElementById('content-area');
    const title = document.getElementById('page-title');

    // Clear Content
    content.innerHTML = '';

    // Render Content based on Tab
    switch (tabName) {
        case 'dashboard':
            title.innerText = 'Dashboard Overview';
            renderDashboard(content);
            break;
        case 'jobs':
            title.innerText = 'Manage Jobs';
            renderJobs(content);
            break;
        case 'applications':
            title.innerText = 'Applications Received';
            renderApplications(content);
            break;
        case 'messages':
            title.innerText = 'Customer Messages';
            renderMessages(content);
            break;
    }
}

// --- RENDERERS ---

function renderDashboard(container) {
    const stats = window.db.getStats();

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Stat Card 1 -->
            <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-2xl">work</span>
                    </div>
                    <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Active</span>
                </div>
                <h3 class="text-3xl font-bold mb-1">${stats.totalJobs}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Active Jobs</p>
            </div>
            <!-- Stat Card 2 -->
            <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <span class="material-symbols-outlined text-2xl">description</span>
                    </div>
                     <span class="text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-1 rounded-full">All Time</span>
                </div>
                <h3 class="text-3xl font-bold mb-1">${stats.totalApplications}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Applications Received</p>
            </div>
            <!-- Stat Card 3 -->
            <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                        <span class="material-symbols-outlined text-2xl">mail</span>
                    </div>
                     <span class="text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-1 rounded-full">All Time</span>
                </div>
                <h3 class="text-3xl font-bold mb-1">${stats.totalMessages}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Messages Received</p>
            </div>
        </div>

        <h3 class="text-lg font-bold mb-4">Recent Activity</h3>
        <div class="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
                        <tr>
                            <th class="px-6 py-4">Type</th>
                            <th class="px-6 py-4">Name</th>
                            <th class="px-6 py-4">Date</th>
                            <th class="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                        ${stats.recentActivity.length ? stats.recentActivity.map(item => `
                            <tr>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 rounded text-xs font-bold ${item.type === 'Application' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}">
                                        ${item.type}
                                    </span>
                                </td>
                                <td class="px-6 py-4 font-medium">${item.name || item.firstName}</td>
                                <td class="px-6 py-4 text-gray-500">${item.date}</td>
                                <td class="px-6 py-4">
                                    <button onclick="switchTab('${item.type === 'Application' ? 'applications' : 'messages'}')" class="text-primary hover:underline">View</button>
                                </td>
                            </tr>
                        `).join('') : `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No recent activity</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderJobs(container) {
    const jobs = window.db.getJobs();

    container.innerHTML = `
        <div class="flex justify-end mb-6">
            <button onclick="openJobModal()" class="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined">add</span>
                Add New Job
            </button>
        </div>

        <div class="grid grid-cols-1 gap-4">
            ${jobs.map(job => `
                <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 group">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <h3 class="text-lg font-bold">${job.title}</h3>
                            <span class="px-3 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold uppercase">${job.category}</span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">location_on</span> ${job.location}</span>
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">schedule</span> ${job.type}</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                         <button onclick="deleteJob(${job.id})" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" title="Delete">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderApplications(container) {
    const apps = window.db.getApplications();

    container.innerHTML = `
         <div class="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
                        <tr>
                            <th class="px-6 py-4">Candidate</th>
                            <th class="px-6 py-4">Position</th>
                            <th class="px-6 py-4">Email</th>
                            <th class="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                        ${apps.length ? apps.map(app => `
                            <tr>
                                <td class="px-6 py-4 font-bold text-[#111418] dark:text-white">${app.name}</td>
                                <td class="px-6 py-4 text-primary">${app.position}</td>
                                <td class="px-6 py-4 text-gray-500">${app.email}</td>
                                <td class="px-6 py-4 text-gray-500 text-xs">${app.date}</td>
                            </tr>
                        `).join('') : `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No applications received yet.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderMessages(container) {
    const msgs = window.db.getMessages();

    container.innerHTML = `
         <div class="grid grid-cols-1 gap-4">
            ${msgs.length ? msgs.map(msg => `
                <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-base font-bold">${msg.subject}</h3>
                            <p class="text-xs text-gray-500">From: <span class="text-[#111418] dark:text-white font-medium">${msg.firstName} ${msg.lastName}</span> (${msg.email})</p>
                        </div>
                        <span class="text-xs text-gray-400">${msg.date}</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
                        ${msg.message}
                    </p>
                    <div class="mt-4 flex justify-end">
                        <button onclick="deleteMessage(${msg.id})" class="text-xs text-red-500 hover:underline">Delete Message</button>
                    </div>
                </div>
            `).join('') : '<p class="text-center text-gray-500 py-10">No messages received yet.</p>'}
        </div>
    `;
}

// --- ACTIONS ---

function openJobModal() {
    const modal = document.getElementById('modal-container');
    modal.innerHTML = `
        <div class="bg-white dark:bg-card-dark w-full max-w-lg rounded-2xl p-8 shadow-2xl animate-fade-in-up">
            <h3 class="text-xl font-bold mb-6">Create New Job</h3>
            <form onsubmit="handleJobSubmit(event)" class="space-y-4">
                <div>
                     <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                     <input required name="title" type="text" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                        <select name="category" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent dark:text-white">
                            <option value="engineering" class="text-black">Engineering</option>
                            <option value="operations" class="text-black">Operations</option>
                            <option value="sales" class="text-black">Sales</option>
                            <option value="banking" class="text-black">Banking</option>
                        </select>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                        <select name="type" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent dark:text-white">
                            <option value="Full Time" class="text-black">Full Time</option>
                            <option value="Part Time" class="text-black">Part Time</option>
                            <option value="Contract" class="text-black">Contract</option>
                        </select>
                    </div>
                </div>
                <div>
                     <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                     <input required name="location" type="text" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent">
                </div>
                <div>
                     <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                     <textarea required name="description" rows="3" class="w-full p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent"></textarea>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">Cancel</button>
                    <button type="submit" class="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Create Job</button>
                </div>
            </form>
        </div>
    `;
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeModal() {
    const modal = document.getElementById('modal-container');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function handleJobSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newJob = {
        title: formData.get('title'),
        category: formData.get('category'),
        type: formData.get('type'),
        location: formData.get('location'),
        description: formData.get('description')
    };

    window.db.addJob(newJob);
    closeModal();
    renderJobs(document.getElementById('content-area')); // Refresh
}

function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
        window.db.deleteJob(id);
        renderJobs(document.getElementById('content-area')); // Refresh
    }
}

function deleteMessage(id) {
    if (confirm('Delete this message?')) {
        window.db.deleteMessage(id);
        renderMessages(document.getElementById('content-area')); // Refresh
    }
}

// Initial Render & Storage Sync
let currentTab = 'dashboard';

window.addEventListener('storage', (e) => {
    // Re-render if relevant data changes in another tab
    if (e.key === 'db_jobs' || e.key === 'db_applications' || e.key === 'db_messages') {
        const content = document.getElementById('content-area');
        if (currentTab === 'dashboard') renderDashboard(content);
        if (currentTab === 'jobs') renderJobs(content);
        if (currentTab === 'applications') renderApplications(content);
        if (currentTab === 'messages') renderMessages(content);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    switchTab('dashboard');
});

// Update switchTab to track state
const originalSwitchTab = switchTab;
switchTab = function (tabName) {
    currentTab = tabName;
    originalSwitchTab(tabName);
}

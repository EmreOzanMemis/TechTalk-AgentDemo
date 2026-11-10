/* Browser-only simulation. No network calls or real agent execution. */
(() => {
    'use strict';

    const agents = {
        planner: {
            name: 'Planner', role: 'Workflow strategist',
            description: 'Turns a dashboard objective into a focused delivery plan.',
            responsibilities: ['Define scope and acceptance criteria.', 'Prioritize visible improvements.', 'Prepare the developer handoff.']
        },
        developer: {
            name: 'Developer', role: 'Implementation specialist',
            description: 'Translates the plan into a responsive dashboard experience.',
            responsibilities: ['Implement the agreed interface.', 'Preserve the existing application architecture.', 'Hand changes to the reviewer.']
        },
        reviewer: {
            name: 'Reviewer', role: 'Quality gate',
            description: 'Examines the proposed changes for demo-blocking issues.',
            responsibilities: ['Check behavior against the plan.', 'Review accessibility and edge cases.', 'Prepare the validation handoff.']
        },
        tester: {
            name: 'Tester', role: 'Validation specialist',
            description: 'Illustrates the validation stage; this simulation does not run Maven or any other tests.',
            responsibilities: ['Describe expected smoke checks.', 'Illustrate the test-result handoff.', 'Report simulated validation status only.']
        },
        orchestrator: {
            name: 'Orchestrator', role: 'Workflow coordinator',
            description: 'Stays active throughout the simulated run, coordinating all four specialist handoffs.',
            responsibilities: ['Sequence planning, development, review, and test.', 'Track simulated progress.', 'Coordinate completion and reset.']
        }
    };
    const sequence = ['planner', 'developer', 'reviewer', 'tester'];
    const labels = ['PLAN', 'DEVELOP', 'REVIEW', 'TEST', 'COMPLETE'];
    const byId = id => document.getElementById(id);
    const cards = Array.from(document.querySelectorAll('[data-agent]'));
    const stages = Array.from(document.querySelectorAll('[data-stage]'));
    const start = byId('start-workflow');
    const reset = byId('reset-workflow');
    let selected = 'planner';
    let current = -1;
    let running = false;
    let complete = false;
    let timer = null;
    let generation = 0;

    function statusFor(key) {
        if (complete) return 'Completed';
        if (!running) return 'Ready';
        if (key === 'orchestrator') return 'Active';
        const index = sequence.indexOf(key);
        return index < current ? 'Completed' : index === current ? 'Active' : 'Ready';
    }

    function setBadge(element, status) {
        element.textContent = 'Demo · ' + status;
        element.className = 'badge badge-pill ' + (status === 'Active' ? 'badge-warning' : status === 'Completed' ? 'badge-success' : 'badge-info');
    }

    function showDetails() {
        const agent = agents[selected];
        byId('detail-name').textContent = agent.name;
        byId('detail-role').textContent = 'Role: ' + agent.role;
        byId('detail-description').textContent = agent.description;
        const list = byId('detail-responsibilities');
        list.textContent = '';
        agent.responsibilities.forEach(text => {
            const item = document.createElement('li');
            item.textContent = text;
            list.appendChild(item);
        });
        setBadge(byId('detail-status'), statusFor(selected));
    }

    function render() {
        const done = complete ? 5 : Math.max(0, current);
        cards.forEach(card => {
            const key = card.dataset.agent;
            const status = statusFor(key);
            card.setAttribute('aria-pressed', String(key === selected));
            card.classList.toggle('selected-agent', key === selected);
            card.classList.toggle('agent-running', status === 'Active');
            setBadge(card.querySelector('[data-agent-status]'), status);
        });
        stages.forEach((stage, index) => {
            const active = running && index === current;
            const completed = index < done;
            stage.classList.toggle('active-stage', active);
            stage.classList.toggle('completed-stage', completed);
            if (active) stage.setAttribute('aria-current', 'step');
            else stage.removeAttribute('aria-current');
            stage.querySelector('.stage-state').textContent = 'Demo · ' + (completed ? 'Completed' : active ? 'Active' : 'Pending');
        });
        const progress = done * 20;
        byId('progress-value').textContent = progress + '%';
        byId('workflow-progress').setAttribute('aria-valuenow', String(progress));
        byId('workflow-progress-bar').style.width = progress + '%';
        byId('completed-stages').textContent = done + ' / 5';
        byId('test-status').textContent = complete ? 'Simulated pass' : current === 3 ? 'Simulating…' : 'Pending';
        setBadge(byId('workflow-status'), complete ? 'Completed' : running ? 'Active' : 'Ready');
        byId('workflow-success').hidden = !complete;
        start.disabled = running;
        start.textContent = running ? 'Demo in progress…' : complete ? 'Run Demo Again' : 'Start Agent Workflow';
        showDetails();
    }

    function log(text) {
        const item = document.createElement('li');
        item.className = 'activity-item';
        item.textContent = 'Simulated demo · ' + text;
        byId('activity-log').appendChild(item);
    }

    function restore() {
        clearTimeout(timer);
        timer = null;
        generation += 1;
        running = false;
        complete = false;
        current = -1;
        selected = 'planner';
        byId('activity-log').textContent = '';
        log('Ready. Start the workflow to see simulated handoffs.');
        byId('workflow-announcement').textContent = 'Demo ready. Select an agent to explore its role, or start the simulation.';
        render();
    }

    function advance(run) {
        if (run !== generation || !running) return;
        if (current >= 0) log(labels[current] + ' completed.');
        current += 1;
        if (current === 4) {
            complete = true;
            running = false;
            timer = null;
            log('COMPLETE. All simulated stages finished; no real execution occurred.');
            byId('workflow-announcement').textContent = 'Demo complete. All five simulated stages finished. No actual agents or tests were run.';
        } else {
            log(agents[sequence[current]].name + ' active. Orchestrator coordinating.');
            byId('workflow-announcement').textContent = 'Simulated demo: ' + labels[current] + ' active. Orchestrator coordinating.';
            timer = setTimeout(() => advance(run), 1800);
        }
        render();
    }

    cards.forEach(card => card.addEventListener('click', () => {
        selected = card.dataset.agent;
        render();
        byId('workflow-announcement').textContent = 'Selected ' + agents[selected].name + '. ' + agents[selected].role + '. Simulated demo status: ' + statusFor(selected) + '. Responsibilities are shown below the agent cards.';
    }));
    start.addEventListener('click', () => {
        if (running) return;
        restore();
        running = true;
        byId('activity-log').textContent = '';
        advance(generation);
    });
    reset.addEventListener('click', restore);
    reset.disabled = false;
    restore();
})();

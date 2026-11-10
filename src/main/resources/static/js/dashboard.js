(function () {
    'use strict';

    var agents = {
        planner: {
            name: 'Planner', role: 'Scope & strategy',
            description: 'Turns a requested feature into a small, ordered delivery plan.',
            responsibilities: ['Clarify the objective and acceptance criteria.', 'Prioritize visible improvements and identify dependencies.', 'Hand the agreed scope to Developer.']
        },
        developer: {
            name: 'Developer', role: 'Implementation',
            description: 'Illustrates implementing the planned feature within the existing application architecture.',
            responsibilities: ['Follow the plan and preserve existing functionality.', 'Build responsive, accessible UI changes.', 'Prepare the implementation for review.']
        },
        reviewer: {
            name: 'Reviewer', role: 'Blocking-issue review',
            description: 'Illustrates checking a proposed change for problems before the test handoff.',
            responsibilities: ['Check the change against acceptance criteria.', 'Identify blocking defects and regressions.', 'Hand reviewed work to Tester.']
        },
        tester: {
            name: 'Tester', role: 'Validation',
            description: 'Illustrates validating behavior and reporting a test outcome; no tests actually run here.',
            responsibilities: ['Verify normal flows and reset scenarios.', 'Check keyboard access and responsive presentation.', 'Report the illustrative test result to Orchestrator.']
        },
        orchestrator: {
            name: 'Orchestrator', role: 'Workflow coordination',
            description: 'Coordinates the simulated sequence from planning through completion.',
            responsibilities: ['Activate one delivery stage at a time.', 'Coordinate handoffs between the four specialist roles.', 'Summarize completion and support a clean restart.']
        }
    };
    var order = ['planner', 'developer', 'reviewer', 'tester'];
    var state = { phase: 'ready', stage: -1, selectedAgent: null, events: [], timer: null, generation: 0 };
    var startButton = document.getElementById('start-workflow');
    var activity = document.getElementById('simulation-activity');

    function statusFor(key) {
        if (key === 'orchestrator') {
            return state.phase === 'running' ? 'coordinating' : state.phase === 'complete' ? 'completed' : 'idle';
        }
        var index = order.indexOf(key);
        if (state.phase === 'complete' || index < state.stage) { return 'completed'; }
        return state.phase === 'running' && index === state.stage ? 'active' : 'pending';
    }

    function paintBadge(element, status) {
        var color = status === 'completed' ? 'success' : status === 'active' || status === 'coordinating' ? 'warning' : 'secondary';
        element.className = 'badge badge-pill badge-' + color;
        element.textContent = 'DEMO · ' + status.toUpperCase();
    }

    function renderModal() {
        if (!state.selectedAgent) { return; }
        var agent = agents[state.selectedAgent];
        document.getElementById('agent-modal-title').textContent = agent.name;
        document.getElementById('agent-modal-role').textContent = agent.role;
        document.getElementById('agent-modal-description').textContent = agent.description;
        paintBadge(document.getElementById('agent-modal-status'), statusFor(state.selectedAgent));
        var list = document.getElementById('agent-modal-responsibilities');
        list.textContent = '';
        agent.responsibilities.forEach(function (responsibility) {
            var item = document.createElement('li');
            item.textContent = responsibility;
            list.appendChild(item);
        });
    }

    function render() {
        var running = state.phase === 'running';
        var complete = state.phase === 'complete';
        var completed = complete ? 4 : Math.max(0, state.stage);
        var percent = completed * 25;
        startButton.disabled = running || complete;
        startButton.textContent = running ? 'Simulation Running…' : complete ? 'Simulation Complete' : 'Start Agent Workflow';
        paintBadge(document.getElementById('workflow-status'), complete ? 'completed' : running ? 'active' : 'ready');
        document.querySelector('.hero-panel').classList.toggle('simulation-complete', complete);
        document.querySelectorAll('[data-stage]').forEach(function (element) {
            var index = Number(element.getAttribute('data-stage'));
            var status = complete ? 'completed' : index < state.stage ? 'completed' : running && index === state.stage ? 'active' : 'pending';
            element.className = 'workflow-stage ' + status + '-stage';
            element.querySelector('.stage-status').textContent = status.charAt(0).toUpperCase() + status.slice(1);
            if (status === 'active') { element.setAttribute('aria-current', 'step'); }
            else { element.removeAttribute('aria-current'); }
        });
        document.querySelectorAll('[data-agent-status]').forEach(function (badge) {
            var status = statusFor(badge.getAttribute('data-agent-status'));
            paintBadge(badge, status);
            badge.closest('.agent-card').setAttribute('data-status', status);
        });
        var progress = document.getElementById('workflow-progress');
        progress.style.width = percent + '%';
        progress.setAttribute('aria-valuenow', String(percent));
        document.getElementById('progress-caption').textContent = completed + ' of 4 simulated agent stages complete · ' + percent + '%';
        document.getElementById('delivery-metric').textContent = complete ? 'COMPLETE' : running ? 'IN PROGRESS' : 'READY';
        document.getElementById('test-metric').textContent = complete ? 'DEMO PASS' : state.stage === 3 ? 'SIMULATING' : 'PENDING';
        document.getElementById('workflow-announcement').textContent = complete
            ? 'Simulation complete! All four demo stages finished. No real code or tests were executed. Reset to run again.'
            : running ? 'Simulation: ' + agents[order[state.stage]].name + ' active. ' + completed + ' of 4 stages complete. Orchestrator coordinating.'
                : 'Simulation ready. Start the workflow or explore an agent.';
        activity.textContent = '';
        var events = state.events.length ? state.events : [{ title: 'Simulation ready', detail: 'Start the workflow to see simulated handoffs. No actual agents are executed.' }];
        events.forEach(function (event) {
            var row = document.createElement('div');
            row.className = 'activity-item';
            var label = document.createElement('span');
            label.className = 'activity-time';
            label.textContent = 'DEMO';
            var content = document.createElement('div');
            var title = document.createElement('h4');
            title.textContent = event.title;
            var detail = document.createElement('p');
            detail.textContent = event.detail;
            content.appendChild(title);
            content.appendChild(detail);
            row.appendChild(label);
            row.appendChild(content);
            activity.appendChild(row);
        });
        renderModal();
    }

    function enterStage(generation) {
        if (generation !== state.generation || state.phase !== 'running') { return; }
        var agent = agents[order[state.stage]];
        state.events.unshift({ title: agent.name + ' · simulated stage active', detail: 'Orchestrator is coordinating this illustrative handoff. No actual work is executed.' });
        render();
        state.timer = window.setTimeout(function () {
            if (generation !== state.generation || state.phase !== 'running') { return; }
            state.events.unshift({ title: agent.name + ' · simulated stage completed', detail: 'Demo step finished on a timer, not a real execution result.' });
            state.stage += 1;
            if (state.stage === order.length) {
                state.timer = null;
                state.phase = 'complete';
                state.events.unshift({ title: 'Simulation complete', detail: 'All demo stages completed successfully. The simulated test outcome is PASS; no tests were run. Reset to try again.' });
                render();
            } else { enterStage(generation); }
        }, 2000);
    }

    startButton.addEventListener('click', function () {
        if (state.phase !== 'ready') { return; }
        state.phase = 'running';
        state.stage = 0;
        state.generation += 1;
        enterStage(state.generation);
    });

    document.getElementById('reset-workflow').addEventListener('click', function () {
        window.clearTimeout(state.timer);
        state.generation += 1;
        state.timer = null;
        state.phase = 'ready';
        state.stage = -1;
        state.events = [];
        render();
        document.getElementById('workflow-announcement').textContent = 'Simulation reset. All demo stages are pending. Ready to start again.';
    });

    // Bootstrap manages focus trapping, Escape, dismissal, and return focus to the card.
    window.jQuery('#agent-modal').on('show.bs.modal', function (event) {
        var key = event.relatedTarget && event.relatedTarget.getAttribute('data-agent');
        if (!Object.prototype.hasOwnProperty.call(agents, key)) { return; }
        state.selectedAgent = key;
        renderModal();
    }).on('hidden.bs.modal', function () {
        state.selectedAgent = null;
    });
    render();
}());

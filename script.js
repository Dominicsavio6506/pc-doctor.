/* PC Doctor - browser-native JavaScript only */
document.addEventListener("DOMContentLoaded", () => {
  // Current year in the footer.
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Mobile navigation.
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  // Guided symptom-based troubleshooting wizard.
  const choices = document.getElementById("symptom-choices");
  const questionArea = document.getElementById("question-area");
  const resultArea = document.getElementById("result-area");
  const progress = document.getElementById("progress-bar");
  const stepCount = document.getElementById("step-count");

  const diagnostics = {
    slow: {
      title: "Your PC is running slowly",
      questions: [
        {q:"When did you first notice the slowdown?",a:["Today, suddenly","Gradually over several weeks","Only when opening one application"],cause:["A recent software change or background task may be involved.","Storage pressure, startup apps or accumulated background tasks may contribute.","The application itself or its resources may be the cause."]},
        {q:"How much free storage space is available?",a:["Very little / almost full","Plenty of free space","I am not sure"],cause:["Low storage can affect updates and normal operation.","Storage may not be the main cause; check memory and background processes.","Check storage usage in your operating system settings."]}
      ],
      solution:["Restart the computer and test again.","Close applications you are not using.","Review startup applications and disable only those you recognize and do not need.","Check free storage and use the operating system's built-in cleanup tool.","Run a scan using reputable security software if you suspect malware."],
      caution:"If the computer repeatedly freezes, makes unusual noises or loses files, stop troubleshooting and seek qualified support."
    },
    power: {
      title:"Your computer will not turn on",
      questions:[
        {q:"What happens when you press the power button?",a:["Nothing happens at all","Lights or fans turn on, but no startup","It starts and immediately switches off"],cause:["Power outlet, cable, charger or internal power hardware may be involved.","The computer may be receiving power but failing during startup.","Power delivery, overheating or hardware protection may be involved."]},
        {q:"Is this a laptop or desktop?",a:["Laptop","Desktop computer","Not sure"],cause:["Check the correct charger and charging indicator.","Check the power cable and wall outlet.","Identify the device type before proceeding."]}
      ],
      solution:["Check the wall outlet using a known working device.","Confirm the power cable or correct laptop charger is firmly connected.","Disconnect non-essential external USB devices and try once more.","For a laptop, allow it to charge for a short period using its correct adapter.","If there is still no response, arrange professional hardware inspection."],
      caution:"Do not open a power supply unit or damaged battery. If you smell burning, see smoke or hear electrical arcing, disconnect power only if safe and seek professional help."
    },
    display: {
      title:"Your screen has no display",
      questions:[
        {q:"Does the monitor show a message?",a:["No signal","The screen is completely black","The manufacturer's logo appears, then it goes black"],cause:["The monitor may not be receiving a video signal.","Brightness, display output or graphics hardware may be involved.","The operating system, driver or startup process may be involved."]},
        {q:"Are you using a separate monitor?",a:["Yes, an external monitor","No, laptop's built-in screen","Both / multiple displays"],cause:["Check monitor power, input source and display cable.","Try adjusting brightness and connecting an external display if available.","Check display selection and cable connections."]}
      ],
      solution:["Confirm the display and computer are powered on.","Select the correct input source on the monitor.","Reconnect the display cable at both ends, if safe.","On a laptop, increase brightness and try the display-toggle shortcut documented by its manufacturer.","If the issue continues, seek qualified inspection of the display or graphics hardware."],
      caution:"Do not open the display panel or computer while powered. A black screen alone does not identify which component has failed."
    },
    wifi: {
      title:"Your internet connection is not working",
      questions:[
        {q:"What does your device show?",a:["Connected, but no internet","Wi-Fi network is not visible","It connects and disconnects repeatedly"],cause:["Router, DNS, provider or device network settings may be involved.","Router broadcast, wireless adapter or range may be involved.","Weak signal, interference or router instability may be involved."]},
        {q:"Do other devices connect to the same Wi-Fi?",a:["No, other devices also have problems","Yes, other devices work normally","I cannot check"],cause:["The router or internet service may be the source.","The issue may be limited to this computer's settings or adapter.","Test another device if possible to narrow down the source."]}
      ],
      solution:["Check that airplane mode is off and Wi-Fi is enabled.","Move closer to the router and reconnect to the correct network.","Restart the router using its normal power procedure.","Test another device on the same network to identify whether the issue is local or network-wide.","If only one computer is affected, use its built-in network troubleshooter."],
      caution:"Never share your Wi-Fi password or router administrator password with an unknown person."
    },
    heat: {
      title:"Your computer is overheating",
      questions:[
        {q:"When does the device become hot?",a:["Even when idle","During games or demanding tasks","After a short period of use"],cause:["Blocked airflow, background tasks or cooling problems may be involved.","High workload naturally increases heat, but excessive heat needs attention.","Airflow, fan operation or cooling hardware may need inspection."]},
        {q:"Can you hear the cooling fan?",a:["Yes, it is unusually loud","No fan sound / airflow","The fan seems normal"],cause:["The cooling system may be working harder due to heat or dust.","A fan or cooling-system fault is possible; seek service.","Check vents and workload; internal cooling still cannot be confirmed remotely."]}
      ],
      solution:["Place the computer on a hard, flat surface.","Keep ventilation openings clear; do not use it on bedding.","Close demanding applications and allow the device to cool.","Use manufacturer-recommended cleaning guidance; do not insert objects into vents.","If overheating continues or the device shuts down, arrange professional service."],
      caution:"Stop using the device if it becomes extremely hot, the battery swells, or you notice smoke or a burning smell."
    },
    crash: {
      title:"Applications are crashing",
      questions:[
        {q:"Does one application crash or several?",a:["Only one application","Several applications","The whole computer freezes or restarts"],cause:["The application installation, settings or compatibility may be involved.","Operating system, memory, drivers or security software may be involved.","A broader system, thermal or hardware issue may be involved."]},
        {q:"When does the crash happen?",a:["Immediately after opening","During a specific task","At random times"],cause:["A damaged installation or startup dependency may be involved.","A feature, file or resource used by that task may be involved.","Background services, updates or unstable hardware may be involved."]}
      ],
      solution:["Write down the application name and exact error message.","Restart the computer and install updates from official sources.","Check whether the application has a known compatibility update.","Back up important application data before repairing or reinstalling it.","If multiple apps crash, check system updates and seek help if crashes continue."],
      caution:"Avoid downloading unofficial 'fixer' tools. Back up important data before major repairs or reinstallations."
    }
  };

  let currentKey = null;
  let questionIndex = 0;
  let answers = [];

  function updateProgress(step) {
    if (progress) progress.style.width = `${Math.min(100, step / 3 * 100)}%`;
    if (stepCount) stepCount.textContent = `STEP ${String(Math.min(step,3)).padStart(2,"0")}`;
  }

  function showQuestion() {
    const item = diagnostics[currentKey];
    const question = item.questions[questionIndex];
    choices.hidden = true;
    resultArea.hidden = true;
    questionArea.hidden = false;
    updateProgress(questionIndex + 2);
    questionArea.innerHTML = `
      <h3 class="question-title">${question.q}</h3>
      <div class="answer-list">${question.a.map((answer,index) => `<button class="answer-option" type="button" data-answer="${index}"><span>0${index+1}</span>${answer}</button>`).join("")}</div>
      <div class="wizard-actions">
        <button type="button" id="back-question">← Back</button>
        <button type="button" id="next-question" disabled>Continue →</button>
      </div>`;
    let selected = null;
    questionArea.querySelectorAll("[data-answer]").forEach(button => {
      button.addEventListener("click", () => {
        selected = Number(button.dataset.answer);
        questionArea.querySelectorAll("[data-answer]").forEach(b => b.style.borderColor = "var(--line)");
        button.style.borderColor = "var(--cyan)";
        questionArea.querySelector("#next-question").disabled = false;
      });
    });
    questionArea.querySelector("#back-question").addEventListener("click", () => {
      if (questionIndex === 0) {
        questionArea.hidden = true;
        choices.hidden = false;
        updateProgress(1);
      } else {
        questionIndex--;
        answers.pop();
        showQuestion();
      }
    });
    questionArea.querySelector("#next-question").addEventListener("click", () => {
      if (selected === null) return;
      answers.push(selected);
      if (questionIndex < item.questions.length - 1) {
        questionIndex++;
        showQuestion();
      } else {
        showResult();
      }
    });
  }

  function showResult() {
    const item = diagnostics[currentKey];
    const likelyCauses = item.questions.map((q,i) => q.cause[answers[i]]);
    questionArea.hidden = true;
    resultArea.hidden = false;
    updateProgress(3);
    resultArea.innerHTML = `
      <div class="result-box">
        <span class="result-tag">DIAGNOSTIC SUMMARY / ${currentKey.toUpperCase()}</span>
        <h3>${item.title}</h3>
        <p>Based on the answers you selected, these are possible areas to check. This is a guide, not a confirmed diagnosis.</p>
        <h4>Possible causes to consider</h4>
        <ul>${likelyCauses.map(c => `<li>${c}</li>`).join("")}</ul>
        <h4>Recommended next steps</h4>
        <ul>${item.solution.map(s => `<li>${s}</li>`).join("")}</ul>
        <p class="result-disclaimer"><strong>Safety:</strong> ${item.caution}</p>
        <div class="wizard-actions"><button type="button" id="restart-diagnosis">↻ Start another diagnosis</button><button type="button" id="print-result">Print summary</button></div>
      </div>`;
    document.getElementById("restart-diagnosis").addEventListener("click", resetWizard);
    document.getElementById("print-result").addEventListener("click", () => window.print());
  }

  function resetWizard() {
    currentKey = null;
    questionIndex = 0;
    answers = [];
    resultArea.hidden = true;
    questionArea.hidden = true;
    choices.hidden = false;
    updateProgress(1);
  }

  if (choices) {
    choices.querySelectorAll("[data-symptom]").forEach(button => {
      button.addEventListener("click", () => {
        currentKey = button.dataset.symptom;
        questionIndex = 0;
        answers = [];
        showQuestion();
      });
    });
  }

  // Demonstration-only feedback form: validate locally; do not transmit or store data.
  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", event => {
      event.preventDefault();
      const status = document.getElementById("feedback-status");
      if (!feedbackForm.reportValidity()) return;
      status.textContent = "Thank you. The sample form passed validation; no message was sent or stored.";
      status.style.color = "var(--green)";
      feedbackForm.reset();
    });
  }
});
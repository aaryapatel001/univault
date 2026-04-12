/* ═══ Semester Data — Loaded from Supabase ═══ */

var semesterData = {};

// Load semesters + subjects from database
(async function loadSemesterData() {
     const { data: semesters } = await supabase
          .from('semesters').select('*').order('number');
     const { data: subjects } = await supabase
          .from('subjects').select('*').order('sort_order');

     if (!semesters || !subjects) {
          console.warn('Failed to load from Supabase, using fallback');
          return;
     }

     semesters.forEach(function (sem) {
          var subs = subjects.filter(function (s) {
               return s.semester_id === sem.id;
          });
          semesterData[sem.number] = {
               label: 'Semester ' + sem.number + ' — ' + sem.title,
               rec: {
                    title: subs[0]?.name || 'Start here',
                    desc: 'Recommended starting point for this semester'
               },
               courses: subs.map(function (s) {
                    return {
                         icon: s.icon, name: s.name,
                         desc: s.description,
                         progress: 0, done: 0,
                         total: s.total_lessons
                    };
               })
          };
     });
     console.log('✅ Loaded ' + subjects.length + ' subjects from Supabase');
})();

// selectSemester — same as before, no changes needed
window.selectSemester = function (num, el) {
     document.querySelectorAll('.sem-card').forEach(function (c) { c.classList.remove('active'); });
     el.classList.add('active');
     var data = semesterData[num];
     if (!data) { console.warn('Semester ' + num + ' not loaded yet'); return; }
     document.getElementById('semSubjectsTitle').textContent = 'Subjects — ' + data.label;
     document.getElementById('semRecTitle').textContent = data.rec.title;
     document.getElementById('semRecDesc').textContent = data.rec.desc;
     var label = document.getElementById('sem-selected-label');
     if (label) { label.textContent = 'Sem ' + num + ' selected'; label.style.display = 'inline-flex'; }
     var grid = document.getElementById('semCourseGrid');
     grid.innerHTML = '';
     data.courses.forEach(function (c) {
          var card = document.createElement('div');
          card.className = 'course-card';
          card.onclick = function () { go('course'); };
          card.innerHTML =
               '<div style="font-size:2.2rem;margin-bottom:10px">' + c.icon + '</div>' +
               '<h3 style="font-size:0.95rem;font-weight:700;margin-bottom:4px">' + c.name + '</h3>' +
               '<p style="font-size:0.76rem;color:var(--sub);margin-bottom:10px">' + c.desc + '</p>' +
               '<div class="prog-bar"><div class="prog-fill" style="width:' + c.progress + '%"></div></div>' +
               '<div style="font-size:0.72rem;color:var(--muted);margin-top:4px">' + c.done + ' / ' + c.total + ' lessons</div>';
          grid.appendChild(card);
     });
     document.getElementById('semSubjectsWrap').style.display = 'block';
     document.getElementById('semPlaceholder').style.display = 'none';
     setTimeout(function () { document.getElementById('semSubjectsWrap').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
};

window.clearSemester = function () {
     document.querySelectorAll('.sem-card').forEach(function (c) { c.classList.remove('active'); });
     document.getElementById('semSubjectsWrap').style.display = 'none';
     document.getElementById('semPlaceholder').style.display = 'block';
     var label = document.getElementById('sem-selected-label');
     if (label) label.style.display = 'none';
};

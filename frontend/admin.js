import { getDatabase, ref, push, onValue, remove }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const db = getDatabase();

// Add hospital
window.addHospital = async () => {
  await push(ref(db,"hospitals"),{
    name:name.value,
    lat:parseFloat(lat.value),
    lng:parseFloat(lng.value),
    icu_beds:parseInt(icu.value),
    doctors:parseInt(doc.value)
  });
};

// Load hospitals
onValue(ref(db,"hospitals"), snap=>{
  const data = snap.val() || {};

  list.innerHTML = Object.entries(data).map(([k,h])=>`
    <div class="card">
      <b>${h.name}</b>
      <p>ICU: ${h.icu_beds}</p>
      <button onclick="del('${k}')">Delete</button>
    </div>
  `).join('');
});

// Delete
window.del = (id)=>{
  remove(ref(db,"hospitals/"+id));
};
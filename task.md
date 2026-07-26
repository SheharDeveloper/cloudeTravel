<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cloud Travel - Booking Confirmation</title>
<style>
  :root{
    --blue: #1e6fe0;
    --blue-dark: #0f4fb0;
    --text-dark: #1a2233;
    --text-mid: #5b6472;
    --text-light: #8b93a1;
    --border: #e7ebf0;
    --bg-page: #eef1f5;
    --card-bg: #ffffff;
    --pill-bg: #f4f6f9;
    --gold: #f5a623;
  }
  *{box-sizing:border-box;}
  body{
    margin:0;
    padding:40px 16px;
    background:var(--bg-page);
    font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    display:flex;
    justify-content:center;
  }
  .card{
    width:420px;
    background:var(--card-bg);
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(20,40,80,0.12);
    border:1px solid var(--border);
  }
  .brand{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    padding:16px 0 8px;
    position:relative;
  }
  .brand-logo{
    position:absolute;
    left:16px;
    top:12px;
    width:34px;
    height:34px;
    border-radius:10px;
    background:linear-gradient(135deg,#2b2f36,#12151a);
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    font-size:16px;
  }
  .brand-name{
    font-weight:700;
    font-size:19px;
    color:var(--blue);
    letter-spacing:0.2px;
  }
  .brand-name span{
    font-weight:400;
    color:var(--text-dark);
    font-size:15px;
    margin-left:2px;
  }
  .hero{
    position:relative;
    margin:0 12px;
    border-radius:14px;
    overflow:hidden;
    height:150px;
  }
  .hero img{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
  }
  .hero-overlay{
    position:absolute;
    left:0;right:0;bottom:0;
    padding:14px;
    background:linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0));
    color:#fff;
  }
  .hero-title{
    font-size:18px;
    font-weight:700;
    margin:0 0 4px;
  }
  .stars{
    color:var(--gold);
    font-size:13px;
    letter-spacing:2px;
  }
  .section{
    padding:16px 18px 4px;
  }
  .section-title{
    display:flex;
    align-items:center;
    gap:6px;
    font-size:13px;
    font-weight:700;
    color:var(--blue);
    text-transform:uppercase;
    letter-spacing:0.4px;
    margin-bottom:10px;
  }
  .accommodation-grid{
    display:flex;
    background:var(--pill-bg);
    border-radius:12px;
    padding:12px 6px;
    text-align:center;
  }
  .accommodation-grid > div{
    flex:1;
    border-right:1px solid var(--border);
  }
  .accommodation-grid > div:last-child{
    border-right:none;
  }
  .grid-label{
    font-size:10px;
    color:var(--text-light);
    text-transform:uppercase;
    letter-spacing:0.4px;
    margin-bottom:4px;
  }
  .grid-value{
    font-size:13px;
    font-weight:700;
    color:var(--text-dark);
  }
  .board-type{
    text-align:center;
    font-size:12.5px;
    color:var(--text-mid);
    padding:10px 0 2px;
  }
  .journey-label{
    text-align:center;
    font-size:11.5px;
    font-weight:700;
    color:var(--blue);
    letter-spacing:0.3px;
    margin:14px 0 8px;
    position:relative;
  }
  .journey-label::before, .journey-label::after{
    content:"";
    position:absolute;
    top:50%;
    width:38%;
    border-top:1px solid var(--border);
  }
  .journey-label::before{ left:0; }
  .journey-label::after{ right:0; }
  .flight-row{
    display:flex;
    align-items:center;
    gap:10px;
    padding:6px 0;
  }
  .flight-icon{
    width:32px;
    height:32px;
    min-width:32px;
    border-radius:9px;
    background:var(--pill-bg);
    display:flex;
    align-items:center;
    justify-content:center;
    color:var(--blue);
    font-size:15px;
  }
  .flight-info{ flex:1; }
  .flight-route{
    font-size:13.5px;
    font-weight:700;
    color:var(--text-dark);
  }
  .flight-meta{
    font-size:11.5px;
    color:var(--text-light);
    margin-top:1px;
  }
  .flight-date{
    font-size:11.5px;
    color:var(--text-mid);
    white-space:nowrap;
  }
  .transfer-box{
    background:var(--pill-bg);
    border-radius:12px;
    padding:12px;
    display:flex;
    gap:10px;
  }
  .transfer-text .line{
    font-size:13px;
    font-weight:700;
    color:var(--text-dark);
    line-height:1.5;
  }
  .transfer-text .sub{
    font-size:11.5px;
    color:var(--text-light);
    margin-top:2px;
  }
  .price-box{
    margin:16px 18px 0;
    background:linear-gradient(135deg, var(--blue), var(--blue-dark));
    border-radius:14px;
    padding:16px 18px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    color:#fff;
  }
  .price-label{
    font-size:13px;
    opacity:0.9;
  }
  .price-old{
    font-size:12px;
    text-decoration:line-through;
    opacity:0.75;
  }
  .price-new{
    font-size:24px;
    font-weight:800;
  }
  .price-off{
    font-size:11.5px;
    background:rgba(255,255,255,0.2);
    display:inline-block;
    padding:2px 8px;
    border-radius:20px;
    margin-top:4px;
  }
  .price-right{ text-align:right; }
  .info-box{
    margin:14px 18px 16px;
    background:var(--pill-bg);
    border-radius:12px;
    padding:12px 14px;
  }
  .info-title{
    font-size:11px;
    font-weight:700;
    color:var(--blue);
    text-transform:uppercase;
    letter-spacing:0.4px;
    margin-bottom:6px;
  }
  .info-box ul{
    margin:0;
    padding-left:16px;
    font-size:12px;
    color:var(--text-mid);
    line-height:1.6;
  }
  .footnote{
    padding:0 18px 12px;
    font-size:10.5px;
    color:var(--text-light);
    line-height:1.6;
  }

  /* Members row under check-in/check-out */
  .members-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:var(--pill-bg);
    border-radius:12px;
    padding:10px 14px;
    margin-top:8px;
    font-size:12.5px;
  }
  .members-row .label{
    color:var(--text-light);
    text-transform:uppercase;
    font-size:10px;
    letter-spacing:0.4px;
    display:block;
    margin-bottom:2px;
  }
  .members-row .value{
    font-weight:700;
    color:var(--text-dark);
    font-size:13px;
  }

  /* Price breakdown */
  .price-breakdown{
    margin:0 18px 12px;
    background:var(--pill-bg);
    border-radius:12px;
    padding:10px 14px;
  }
  .breakdown-row{
    display:flex;
    justify-content:space-between;
    font-size:12.5px;
    color:var(--text-mid);
    padding:5px 0;
    border-bottom:1px dashed var(--border);
  }
  .breakdown-row:last-child{
    border-bottom:none;
  }
  .breakdown-row .val{
    font-weight:700;
    color:var(--text-dark);
  }

  /* Accept / Reject buttons */
  .action-row{
    display:flex;
    gap:10px;
    padding:4px 18px 18px;
  }
  .btn{
    flex:1;
    padding:13px 0;
    border-radius:12px;
    border:none;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    transition:transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn:active{ transform:scale(0.97); }
  .btn-accept{
    background:linear-gradient(135deg, var(--blue), var(--blue-dark));
    color:#fff;
    box-shadow:0 6px 16px rgba(30,111,224,0.35);
  }
  .btn-reject{
    background:#fff;
    color:var(--text-mid);
    border:1.5px solid var(--border);
  }
  .btn-reject:hover{
    border-color:#d33;
    color:#d33;
  }

  /* Modal */
  .modal-overlay{
    position:fixed;
    inset:0;
    background:rgba(15,20,30,0.55);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:100;
    padding:20px;
  }
  .modal-overlay.show{
    display:flex;
  }
  .modal-box{
    background:#fff;
    border-radius:18px;
    width:280px;
    padding:26px 22px 22px;
    text-align:center;
    box-shadow:0 20px 50px rgba(0,0,0,0.3);
    animation:pop 0.25s ease;
  }
  @keyframes pop{
    from{ transform:scale(0.85); opacity:0; }
    to{ transform:scale(1); opacity:1; }
  }
  .modal-icon{
    width:56px;
    height:56px;
    border-radius:50%;
    background:linear-gradient(135deg, var(--blue), var(--blue-dark));
    color:#fff;
    font-size:26px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 auto 14px;
  }
  .modal-title{
    font-size:16px;
    font-weight:700;
    color:var(--text-dark);
    margin-bottom:6px;
  }
  .modal-text{
    font-size:12.5px;
    color:var(--text-mid);
    line-height:1.5;
    margin-bottom:18px;
  }
  .modal-close{
    background:var(--pill-bg);
    border:none;
    padding:11px 24px;
    border-radius:10px;
    font-weight:700;
    font-size:13px;
    color:var(--blue-dark);
    cursor:pointer;
    width:100%;
  }
  .reason-box{
    display:none;
  }
  .reason-box.show{
    display:block;
  }
  .reason-textarea{
    width:100%;
    min-height:80px;
    border:1.5px solid var(--border);
    border-radius:10px;
    padding:10px 12px;
    font-family:inherit;
    font-size:12.5px;
    color:var(--text-dark);
    resize:none;
    margin-bottom:14px;
    outline:none;
  }
  .reason-textarea:focus{
    border-color:var(--blue);
  }
  .modal-btn-row{
    display:flex;
    gap:8px;
  }
  .modal-btn-row .modal-close{
    flex:1;
  }
  .modal-submit{
    background:linear-gradient(135deg, #e05555, #b03030);
    color:#fff;
  }
</style>
</head>
<body>

<div class="card">

  <div class="brand">
    <div class="brand-logo">☁</div>
    <div class="brand-name">Cloud <span>Travel</span></div>
  </div>

  <div class="hero">
    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" alt="Grand Hotel & Spa">
    <div class="hero-overlay">
      <div class="hero-title">Grand Hotel &amp; Spa</div>
      <div class="stars">★★★★★</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🏨 Accommodation</div>
    <div class="accommodation-grid">
      <div>
        <div class="grid-label">Check-in</div>
        <div class="grid-value">Sun, 26 Jul 2026</div>
      </div>
      <div>
        <div class="grid-label">Check-out</div>
        <div class="grid-value">Wed, 29 Jul 2026</div>
      </div>
      <div>
        <div class="grid-label">Nights</div>
        <div class="grid-value">3</div>
      </div>
    </div>
    <div class="board-type">Half Board</div>
    <div class="members-row">
      <div>
        <span class="label">Members</span>
        <span class="value">2 Adults, 1 Child</span>
      </div>
      <div style="text-align:right;">
        <span class="label">Room</span>
        <span class="value">1 Deluxe Room</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">✈️ Flights</div>

    <div class="journey-label">OUTBOUND JOURNEY</div>
    <div class="flight-row">
      <div class="flight-icon">✈</div>
      <div class="flight-info">
        <div class="flight-route">Stansted → Tirana</div>
        <div class="flight-meta">Ryan Air • Economy</div>
      </div>
      <div class="flight-date">Sun, 26 Jul 2026</div>
    </div>

    <div class="journey-label">INBOUND JOURNEY</div>
    <div class="flight-row">
      <div class="flight-icon">✈</div>
      <div class="flight-info">
        <div class="flight-route">Tirana → Stansted</div>
        <div class="flight-meta">Ryan Air • Economy</div>
      </div>
      <div class="flight-date">Wed, 29 Jul 2026</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🚐 Transfers</div>
    <div class="transfer-box">
      <div class="flight-icon">🚗</div>
      <div class="transfer-text">
        <div class="line">Airport → Hotel</div>
        <div class="line">Hotel → Airport</div>
        <div class="sub">Private Sedan</div>
      </div>
    </div>
  </div>

  <div class="price-breakdown">
    <div class="breakdown-row"><span>Accommodation</span><span class="val">£389.00</span></div>
    <div class="breakdown-row"><span>Flights (round trip)</span><span class="val">£210.00</span></div>
    <div class="breakdown-row"><span>Transfers</span><span class="val">£60.00</span></div>
  </div>

  <div class="price-box">
    <div class="price-label">Total Price</div>
    <div class="price-right">
      <div class="price-old">£709.00</div>
      <div class="price-new">£659.00</div>
      <div class="price-off">£50 off</div>
    </div>
  </div>

  <div class="info-box">
    <div class="info-title">Additional Information</div>
    <ul>
      <li>If you book today you will get £100 discount</li>
      <li>10kg luggage included</li>
    </ul>
  </div>

  <div class="footnote">
    • Prices are subject to availability<br>
    • T&amp;Cs apply
  </div>

  <div class="action-row">
    <button class="btn btn-reject" onclick="showModal('reject')">Reject</button>
    <button class="btn btn-accept" onclick="showModal('accept')">Accept</button>
  </div>

</div>

<div class="modal-overlay" id="modalOverlay">
  <div class="modal-box">
    <div class="modal-icon" id="modalIcon">✓</div>
    <div class="modal-title" id="modalTitle">Booking Accepted</div>
    <div class="modal-text" id="modalText">
      Your booking for Grand Hotel &amp; Spa (26–29 Jul 2026) has been confirmed. A confirmation email will be sent shortly.
    </div>

    <div class="reason-box" id="reasonBox">
      <textarea class="reason-textarea" id="reasonInput" placeholder="Tell us why you're rejecting this booking..."></textarea>
    </div>

    <div id="acceptButtons">
      <button class="modal-close" onclick="closeModal()">Close</button>
    </div>

    <div class="modal-btn-row" id="rejectButtons" style="display:none;">
      <button class="modal-close" onclick="closeModal()">Cancel</button>
      <button class="modal-close modal-submit" onclick="submitReason()">Submit</button>
    </div>
  </div>
</div>

<script>
  function showModal(type){
    const overlay = document.getElementById('modalOverlay');
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const text = document.getElementById('modalText');
    const reasonBox = document.getElementById('reasonBox');
    const acceptButtons = document.getElementById('acceptButtons');
    const rejectButtons = document.getElementById('rejectButtons');
    const reasonInput = document.getElementById('reasonInput');

    reasonInput.value = '';

    if(type === 'accept'){
      icon.textContent = '✓';
      icon.style.background = 'linear-gradient(135deg, #1e6fe0, #0f4fb0)';
      title.textContent = 'Booking Accepted';
      text.textContent = 'Your booking for Grand Hotel & Spa (26–29 Jul 2026) has been confirmed. A confirmation email will be sent shortly.';
      reasonBox.classList.remove('show');
      acceptButtons.style.display = 'block';
      rejectButtons.style.display = 'none';
    } else {
      icon.textContent = '✕';
      icon.style.background = 'linear-gradient(135deg, #e05555, #b03030)';
      title.textContent = 'Reject Booking';
      text.textContent = 'Please let us know why you\'re rejecting this offer.';
      reasonBox.classList.add('show');
      acceptButtons.style.display = 'none';
      rejectButtons.style.display = 'flex';
    }
    overlay.classList.add('show');
  }

  function submitReason(){
    const reason = document.getElementById('reasonInput').value.trim();
    const title = document.getElementById('modalTitle');
    const text = document.getElementById('modalText');
    const reasonBox = document.getElementById('reasonBox');
    const rejectButtons = document.getElementById('rejectButtons');
    const acceptButtons = document.getElementById('acceptButtons');

    title.textContent = 'Booking Rejected';
    text.textContent = reason
      ? 'Your booking has been declined. Reason noted: "' + reason + '"'
      : 'Your booking has been declined. No charges have been made.';
    reasonBox.classList.remove('show');
    rejectButtons.style.display = 'none';
    acceptButtons.style.display = 'block';
  }

  function closeModal(){
    document.getElementById('modalOverlay').classList.remove('show');
  }
</script>

</body>
</html>

// Admin panel UI (served as a single HTML string by server.js)
module.exports = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CodeSquad — Content Admin</title>
<style>
  :root{--navy:#1e3a5f;--navy2:#2b4d78;--ink:#0f1b2d;--muted:#5b6b7f;--line:#e3e8ef;--bg:#f4f6f9;--card:#fff;--ok:#127a4b;--danger:#c0392b}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--ink)}
  a{color:var(--navy2)}
  header{background:linear-gradient(135deg,var(--navy),var(--navy2));color:#fff;padding:16px 22px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:5}
  header h1{font-size:17px;margin:0;letter-spacing:.2px}
  header .sub{opacity:.8;font-size:12px;margin-top:2px}
  .btn{border:0;border-radius:9px;padding:10px 16px;font-size:14px;font-weight:600;cursor:pointer;background:var(--navy);color:#fff;transition:.15s}
  .btn:hover{background:var(--navy2)}
  .btn.ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}
  .btn.sm{padding:6px 11px;font-size:12.5px;border-radius:7px}
  .btn.danger{background:#fff;color:var(--danger);border:1px solid #f0cfcb}
  .btn.danger:hover{background:var(--danger);color:#fff}
  .wrap{max-width:1040px;margin:0 auto;padding:22px}
  .tabs{display:flex;gap:8px;margin-bottom:18px}
  .tab{padding:9px 16px;border-radius:9px;background:#fff;border:1px solid var(--line);cursor:pointer;font-weight:600;font-size:14px;color:var(--muted)}
  .tab.on{background:var(--navy);color:#fff;border-color:var(--navy)}
  .row{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:11px;padding:12px 14px;margin-bottom:10px}
  .row img{width:64px;height:44px;object-fit:cover;border-radius:7px;background:#eef1f5;flex:none}
  .row .meta{flex:1;min-width:0}
  .row .meta b{display:block;font-size:14.5px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row .meta span{font-size:12px;color:var(--muted)}
  .pill{display:inline-block;background:#eef2f7;color:var(--navy2);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;margin-right:6px}
  .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:20px}
  label{display:block;font-size:12.5px;font-weight:600;color:var(--muted);margin:14px 0 6px}
  input,select,textarea{width:100%;border:1px solid var(--line);border-radius:9px;padding:10px 12px;font-size:14px;font-family:inherit;background:#fff;color:var(--ink)}
  textarea{min-height:340px;resize:vertical;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .imgrow{display:flex;gap:12px;align-items:center;margin-top:6px}
  .imgrow img{width:120px;height:74px;object-fit:cover;border-radius:9px;border:1px solid var(--line);background:#eef1f5}
  .hint{font-size:11.5px;color:var(--muted);margin-top:6px}
  .barbtns{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}
  .barbtns button{font-size:12px;padding:5px 9px;border:1px solid var(--line);background:#fff;border-radius:7px;cursor:pointer;color:var(--navy2)}
  .center{min-height:100vh;display:flex;align-items:center;justify-content:center}
  .login{width:340px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px;text-align:center;box-shadow:0 12px 40px rgba(15,27,45,.08)}
  .login h2{margin:6px 0 4px}
  .login p{color:var(--muted);font-size:13px;margin:0 0 16px}
  .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:11px 18px;border-radius:9px;font-size:13.5px;opacity:0;transition:.25s;pointer-events:none;z-index:20}
  .toast.show{opacity:1}
  .toast.ok{background:var(--ok)}.toast.err{background:var(--danger)}
  .hide{display:none!important}
  .empty{text-align:center;color:var(--muted);padding:30px;font-size:14px}
  @media(max-width:640px){.grid2{grid-template-columns:1fr}}
</style>
</head>
<body>

<div id="loginView" class="center">
  <div class="login">
    <h2>CodeSquad Admin</h2>
    <p>Local content dashboard</p>
    <input id="pw" type="password" placeholder="Password" onkeydown="if(event.key==='Enter')login()"/>
    <button class="btn" style="width:100%;margin-top:12px" onclick="login()">Sign in</button>
  </div>
</div>

<div id="app" class="hide">
  <header>
    <div>
      <h1>CodeSquad Content Admin</h1>
      <div class="sub">Blogs &amp; case studies — saved straight into your project files</div>
    </div>
    <button class="btn ghost sm" onclick="logout()">Sign out</button>
  </header>

  <div class="wrap">
    <!-- LIST -->
    <div id="listView">
      <div class="tabs">
        <div class="tab on" id="tabBlog" onclick="setType('blog')">Blogs</div>
        <div class="tab" id="tabCase" onclick="setType('case')">Case studies</div>
      </div>
      <div class="toolbar">
        <div id="count" class="hint"></div>
        <button class="btn" onclick="newItem()">+ New <span id="newLabel">blog</span></button>
      </div>
      <div id="list"></div>
    </div>

    <!-- EDITOR -->
    <div id="editView" class="hide">
      <div class="toolbar">
        <button class="btn ghost sm" onclick="showList()">← Back</button>
        <div style="display:flex;gap:8px">
          <button class="btn danger sm" id="delBtn" onclick="delItem()">Delete</button>
          <button class="btn" onclick="save()">Save</button>
        </div>
      </div>
      <div class="card">
        <div id="fields"></div>

        <label>Body content (HTML)</label>
        <div class="barbtns" id="bar"></div>
        <textarea id="body" placeholder="Paste or write the article/case-study HTML here..."></textarea>
        <div class="hint">This is the full page body. Use the buttons above to insert common blocks. Images you upload are added at the cursor as &lt;img&gt; tags.</div>
      </div>
    </div>
  </div>
</div>

<div id="toast" class="toast"></div>

<script>
var TOKEN=null, TYPE='blog', DATA={blogPosts:[],caseStudies:[]}, EDITING=null;
var BLOG_CATS=['AI Automation','SMEs','AEO / SEO','Business Growth','Software Development','Lead Generation'];
var CASE_FILTERS=['Healthcare & Clinics','E-commerce','Legal Services','Automotive','Education','Financial Services'];

function toast(m,k){var t=document.getElementById('toast');t.textContent=m;t.className='toast show '+(k||'');setTimeout(function(){t.className='toast';},2600);}
function api(path,opts){opts=opts||{};opts.headers=Object.assign({'Content-Type':'application/json','x-token':TOKEN||''},opts.headers||{});return fetch(path,opts).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'Error');return j;});});}

function login(){
  var pw=document.getElementById('pw').value;
  fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})})
    .then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error);return j;});})
    .then(function(j){TOKEN=j.token;document.getElementById('loginView').classList.add('hide');document.getElementById('app').classList.remove('hide');loadData();})
    .catch(function(e){toast(e.message,'err');});
}
function logout(){TOKEN=null;location.reload();}

function loadData(){return api('/api/data').then(function(j){DATA=j;render();});}
function setType(t){TYPE=t;document.getElementById('tabBlog').classList.toggle('on',t==='blog');document.getElementById('tabCase').classList.toggle('on',t==='case');document.getElementById('newLabel').textContent=t==='blog'?'blog':'case study';render();}
function list(){return TYPE==='blog'?DATA.blogPosts:DATA.caseStudies;}

function render(){
  showList();
  var items=list();
  document.getElementById('count').textContent=items.length+' '+(TYPE==='blog'?'blog posts':'case studies');
  var h=items.map(function(it,i){
    var title=TYPE==='blog'?(it.title||it.slug):(it.name||it.slug);
    var sub=TYPE==='blog'?((it.cat||'')+' · '+(it.date||'')):((it.cat||'')+' · '+(it.filter||''));
    return '<div class="row"><img src="'+(it.img||'')+'" onerror="this.style.visibility=\\'hidden\\'"/>'+
      '<div class="meta"><b>'+esc(title)+'</b><span><span class="pill">'+esc(it.slug)+'</span>'+esc(sub)+'</span></div>'+
      '<button class="btn ghost sm" onclick="edit('+i+')">Edit</button></div>';
  }).join('');
  document.getElementById('list').innerHTML=items.length?h:'<div class="empty">Nothing yet. Click “+ New” to create one.</div>';
}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function showList(){document.getElementById('listView').classList.remove('hide');document.getElementById('editView').classList.add('hide');}

function fieldHtml(){
  if(TYPE==='blog'){
    return '<div class="grid2">'+
      inp('title','Title','')+
      inp('slug','Slug (URL)','auto from title if blank')+
      sel('cat','Category',BLOG_CATS)+
      inp('date','Date','e.g. September 2, 2026')+
      '</div>'+
      ta('excerpt','Excerpt (list summary)')+
      imgField();
  }
  return '<div class="grid2">'+
    inp('name','Name (client / project)','')+
    inp('slug','Slug (URL)','auto from name if blank')+
    inp('cat','Category label','e.g. Medical Aesthetics')+
    sel('filter','Filter group',CASE_FILTERS)+
    '</div>'+
    ta('tagline','Tagline (list summary)')+
    imgField();
}
function inp(k,l,ph){return '<div><label>'+l+'</label><input id="f_'+k+'" placeholder="'+ph+'"/></div>';}
function sel(k,l,opts){return '<div><label>'+l+'</label><select id="f_'+k+'">'+opts.map(function(o){return '<option>'+o+'</option>';}).join('')+'</select></div>';}
function ta(k,l){return '<label>'+l+'</label><textarea id="f_'+k+'" style="min-height:70px;font-family:inherit;font-size:14px"></textarea>';}
function imgField(){return '<label>Cover image</label><div class="imgrow"><img id="imgPrev" src="" onerror="this.style.visibility=\\'hidden\\'"/><div style="flex:1"><input id="f_img" placeholder="/uploads/... or https://..." oninput="document.getElementById(\\'imgPrev\\').src=this.value;document.getElementById(\\'imgPrev\\').style.visibility=\\'visible\\'"/><div style="margin-top:8px"><input type="file" accept="image/*" id="imgFile" onchange="uploadCover(this)"/></div><div class="hint">Upload a file or paste an image URL.</div></div></div>';}

function getVal(k){var el=document.getElementById('f_'+k);return el?el.value:'';}
function setVal(k,v){var el=document.getElementById('f_'+k);if(el)el.value=v==null?'':v;}

function buildBar(){
  var b=[['H2','<h2>Heading</h2>\\n'],['Paragraph','<p>Text...</p>\\n'],['Subhead','<h3>Subheading</h3>\\n'],['List','<ul>\\n  <li>Point one</li>\\n  <li>Point two</li>\\n</ul>\\n'],['Quote','<blockquote>Quote...</blockquote>\\n'],['Image','<img src="/uploads/..." alt=""/>\\n']];
  document.getElementById('bar').innerHTML=b.map(function(x,i){return '<button type="button" onclick="insert('+i+')">'+x[0]+'</button>';}).join('')+
    '<button type="button" onclick="document.getElementById(\\'bodyFile\\').click()">Insert image file</button><input type="file" id="bodyFile" accept="image/*" class="hide" onchange="uploadBody(this)"/>';
  window.__bar=b;
}
function insert(i){var t=window.__bar[i][1].replace(/\\\\n/g,'\\n');insertAtCursor(t);}
function insertAtCursor(text){var ta=document.getElementById('body');var s=ta.selectionStart,e=ta.selectionEnd;ta.value=ta.value.slice(0,s)+text+ta.value.slice(e);ta.selectionStart=ta.selectionEnd=s+text.length;ta.focus();}

function newItem(){EDITING=null;openEditor(TYPE==='blog'?{cat:'AI Automation'}:{filter:'Healthcare & Clinics'},'');document.getElementById('delBtn').classList.add('hide');}
function edit(i){var it=list()[i];EDITING=it.slug;api('/api/content?type='+(TYPE==='blog'?'blog':'case')+'&slug='+encodeURIComponent(it.slug)).then(function(j){openEditor(it,j.body||'');document.getElementById('delBtn').classList.remove('hide');});}

function openEditor(it,body){
  document.getElementById('listView').classList.add('hide');
  document.getElementById('editView').classList.remove('hide');
  document.getElementById('fields').innerHTML=fieldHtml();
  buildBar();
  if(TYPE==='blog'){setVal('title',it.title);setVal('slug',it.slug);setVal('date',it.date);setVal('excerpt',it.excerpt);setVal('cat',it.cat||'AI Automation');}
  else{setVal('name',it.name);setVal('slug',it.slug);setVal('cat',it.cat);setVal('tagline',it.tagline);setVal('filter',it.filter||'Healthcare & Clinics');}
  setVal('img',it.img);var ip=document.getElementById('imgPrev');ip.src=it.img||'';ip.style.visibility=it.img?'visible':'hidden';
  document.getElementById('body').value=body||'';
}

function uploadCover(input){var f=input.files[0];if(!f)return;toBase64(f).then(function(d){return api('/api/upload',{method:'POST',body:JSON.stringify({filename:f.name,dataBase64:d,folder:TYPE==='blog'?'blog':'case-studies'})});}).then(function(j){setVal('img',j.path);var ip=document.getElementById('imgPrev');ip.src=j.path;ip.style.visibility='visible';toast('Image uploaded','ok');}).catch(function(e){toast(e.message,'err');});}
function uploadBody(input){var f=input.files[0];if(!f)return;toBase64(f).then(function(d){return api('/api/upload',{method:'POST',body:JSON.stringify({filename:f.name,dataBase64:d,folder:TYPE==='blog'?'blog':'case-studies'})});}).then(function(j){insertAtCursor('<img src="'+j.path+'" alt=""/>\\n');toast('Image inserted','ok');}).catch(function(e){toast(e.message,'err');});input.value='';}
function toBase64(f){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=rej;r.readAsDataURL(f);});}

function save(){
  var post=TYPE==='blog'
    ?{title:getVal('title'),slug:getVal('slug'),cat:getVal('cat'),date:getVal('date'),excerpt:getVal('excerpt'),img:getVal('img')}
    :{name:getVal('name'),slug:getVal('slug'),cat:getVal('cat'),tagline:getVal('tagline'),filter:getVal('filter'),img:getVal('img')};
  if(TYPE==='blog'&&!post.title){toast('Title is required','err');return;}
  if(TYPE==='case'&&!post.name){toast('Name is required','err');return;}
  var url=TYPE==='blog'?'/api/blog/save':'/api/case/save';
  api(url,{method:'POST',body:JSON.stringify({original:EDITING,post:post,body:document.getElementById('body').value})})
    .then(function(j){toast('Saved ✓  (deploy to publish)','ok');return loadData();})
    .then(function(){render();}).catch(function(e){toast(e.message,'err');});
}
function delItem(){
  if(!EDITING)return;if(!confirm('Delete this '+(TYPE==='blog'?'blog post':'case study')+'? This cannot be undone.'))return;
  var url=TYPE==='blog'?'/api/blog/delete':'/api/case/delete';
  api(url,{method:'POST',body:JSON.stringify({slug:EDITING})}).then(function(){toast('Deleted','ok');return loadData();}).then(render).catch(function(e){toast(e.message,'err');});
}
</script>
</body>
</html>`;

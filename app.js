/* Studio 72 shared behavior */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu */
  var btn=document.querySelector('.menu-btn'),links=document.getElementById('navlinks');
  if(btn&&links){
    btn.addEventListener('click',function(){
      var open=links.classList.toggle('open');
      btn.setAttribute('aria-expanded',open);
    });
    links.addEventListener('click',function(e){if(e.target.tagName==='A'){links.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  }

  /* nav shadow when page is scrolled (sentinel, no scroll listeners) */
  var head=document.querySelector('header.site');
  if(head&&'IntersectionObserver' in window){
    var sent=document.createElement('div');
    sent.style.cssText='position:absolute;top:0;left:0;height:2px;width:1px;pointer-events:none';
    document.body.prepend(sent);
    new IntersectionObserver(function(en){
      head.classList.toggle('scrolled',!en[0].isIntersecting);
    }).observe(sent);
  }

  /* reveal choreography */
  if(!reduce&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});
  }else{
    document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});
  }

  /* tour frames: full-site photographs gliding inside browser chrome */
  var tours=Array.prototype.slice.call(document.querySelectorAll('.tour'));
  function fit(t){
    var img=t.querySelector('img');if(!img||!img.complete||!img.naturalHeight)return;
    var travel=img.clientHeight-t.clientHeight;
    if(travel>0){
      t.style.setProperty('--travel',(-travel)+'px');
      var secs=Math.min(52,Math.max(22,Math.round(travel/90)));
      t.style.setProperty('--tour-dur',secs+'s');
    }
  }
  tours.forEach(function(t){
    var img=t.querySelector('img');
    if(img){img.complete?fit(t):img.addEventListener('load',function(){fit(t);});}
  });
  if('IntersectionObserver' in window){
    var tio=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){fit(en.target);en.target.classList.add('play');}
        else{en.target.classList.remove('play');}
      });
    },{rootMargin:'250px 0px'});
    tours.forEach(function(t){tio.observe(t);});
    setTimeout(function(){tours.forEach(function(t){fit(t);t.classList.add('play');});},2500);
  }else{
    tours.forEach(function(t){fit(t);t.classList.add('play');});
  }
  window.addEventListener('resize',function(){tours.forEach(fit);});

  /* lead form (contact page): validate, then let the real POST through */
  var sform=document.querySelector('.form-card[data-lead]');
  if(sform){
    sform.addEventListener('submit',function(e){
      var ok=true;
      ['s-name','s-email'].forEach(function(id){
        var input=document.getElementById(id),field=input.closest('.field');
        if(!input.value.trim()){field.classList.add('invalid');ok=false;}
        else field.classList.remove('invalid');
      });
      if(!ok){e.preventDefault();}
    });
  }
})();

document.querySelector('.desktop').style.display = 'none';
let round;
let current_round=1;
let odds_right=1
let chip1=1000;
let chip2=1000;
// 选择局数
document.querySelector('#start-btn').addEventListener('click',function(){
  round=document.querySelector('input').value||3;
  document.querySelector('.Tn-rounds').innerText=`总局数:${round}`;
  document.querySelector('.Rn-rounds').innerText=`剩余回合:${round-current_round}`;
  document.querySelector('h1').innerText=`Round:${current_round}`;
  document.querySelector('.chip.left').innerText=`筹码:${chip1}`;
  document.querySelector('.chip.right').innerText=`筹码:${chip2}`;
  document.querySelector('.pre').style.display='none';
  document.querySelector('.desktop').style.display = 'block';
})
let arr1=[0,0,0,0,0];
let arr2=[0,0,0,0,0];
let player1_lock=0;
let player2_lock=0;
let count1=0;
let count2=0;

function machine_action(){
    const arr=[0,0,0,0,0]; // 存结果
    const count_num=[0,0,0,0,0,0];
    let flag=0
    const player=document.querySelector(`.player-area.right`);
    for(let i=1;i<=5;i++){
        arr[i-1]=Number(player.querySelector(`.dice${i}`).dataset.value);
        count_num[Number(player.querySelector(`.dice${i}`).dataset.value)-1]++;
    }
    let max=0 // 出现次数最多的那个数-1
    for(let i=0;i<count_num.length;i++){
        if(count_num[i]>=count_num[max]){
            max=i;
        }
    }
    console.log(arr);
    console.log(count_num);
    if(count_num[max]!==1){
        for(let i=1;i<=5;i++){
            if(max+1===arr[i-1]&&!player.querySelector(`.dice${i}`).classList.contains('lock')){
                player.querySelector(`.dice${i}`).classList.add('lock');
                player2_lock++;
                flag=1
            }
        }
    }
    if(flag){
        return;
    }
    for(let i=1;i<=5;i++){
        if(arr[i-1]>=4&&!player.querySelector(`.dice${i}`).classList.contains('lock')){
            player.querySelector(`.dice${i}`).classList.add('lock');
            player2_lock++;
        }
    }
    return;
}

function rollDice(str) {
    // console.log(str)
    let btn=document.getElementById(`${str}-lock-btn`)
    btn.style.display='none';
    const player=document.querySelector(`.player-area.${str}`);
    document.getElementById(`${str}-roll-btn`).addEventListener("click", function() {  
        btn.style.display='block';
        if(str==='left'&&count1>=2)
        {
            count1++;
        }
        else if(str==='right'&&count2>=2){
            count2++;
        }    
        for (let i=1;i<=5;i++){
            const dice=player.querySelector(`.dice${i}`)
            if(dice.classList.contains('lock')){
                continue;
            }
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            let side;
            switch(randomNumber){
                case 1:side='⚀';break;
                case 2:side='⚁';break;
                case 3:side='⚂';break;
                case 4:side='⚃';break;
                case 5:side='⚄';break;
                case 6:side='⚅';break;
            }
            // 只找第一个，即投掷区的dice
            player.querySelector(`.dice${i}`).innerText=side;
            player.querySelector(`.dice${i}`).dataset.value=randomNumber;
            // 第三轮摇完赋值后直接全部锁定
            if(count1===3&&str==='left'){
                dice.classList.add('lock');
                player1_lock++;
            }
            else if(count2===3&&str==='right'){
                dice.classList.add('lock');
                player2_lock++;
            }
        }
        
         // // ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
    });
   

    // 点击选择要锁定的骰子
    player.querySelector('.Throwing-area').addEventListener('click', function(e){
        // console.log(e);
        if(!e.target.classList.contains('lock')){
            e.target.classList.add('lock');
            if(str==='left')
            {
                player1_lock++;
            }
            else if(str==='right'){
                player2_lock++;
            }    
        }
        
    })
    // 确认锁定
    document.getElementById(`${str}-lock-btn`).addEventListener('click', function(){
        for (let i=1;i<=5;i++){
            const dice=player.querySelector(`.dice${i}`)
            if(dice.classList.contains('lock')){
                player.querySelector(`.lock${i}`).innerText=dice.innerText
                dice.style.opacity=0;
                btn.style.display='none';
            }    
        }
        if(str==='left'&&count1<2)
        {
            count1++;
        }
        else if(str==='right'&&count2<2){
            count2++;
        }
        if(str==='left'){
            setTimeout(function(){
                document.getElementById('right-roll-btn').click();
                machine_action()
                document.getElementById('right-lock-btn').click();
            },1000)
        }   
    })
}

// 定时器1
function timer1(){
    const id1=setInterval(function(){
        if(count1>=1&&count2>=1){
            clearInterval(id1);
            odds_selector();
            
        }
    },1000)
}
// 定时器二
function timer2(){
    const id2=setInterval(function(){
        if(count2>=2&&count1>=2){
            clearInterval(id2);
            odds_selector();
            
        }
    },1000)
}
// 定时器三
function timer3(){
    const id3=setInterval(function(){
        // console.log(player1_lock)
        // console.log(player2_lock)
        if(player1_lock===5&&player2_lock===5){
            // 满足条件，说明全部锁定，进行结算
            clearInterval(id3);
            settlement();
            
        }
    },1000)
}

function set_hmodds(){
    const odds2Select=document.getElementById('odds2');
    const randomOdds=Math.floor(Math.random()*4);
    odds2Select.value=randomOdds;
}

function odds_selector(){
    set_hmodds()
    document.querySelector('.desktop').style.display = 'none';
    const odds_area=document.querySelector('.odds_select');
    odds_area.style.visibility='visible';
    let count=1;
    document.getElementById('confirm-btn').addEventListener('click', function(){
        let o1=document.getElementById('odds1').value;
        let o2=document.getElementById('odds2').value;
        o1=Number(o1);
        o2=Number(o2);
        // console.log(o1)
        // console.log(o2)
        const tto=o1+o2;
        // 莫名其妙的bug
        if(count){
            odds_right+=tto;
            count=0;
        }
        // console.log(odds_right)
        odds_area.style.vilibility='hidden';
        document.querySelector('.Total-odds').innerText=`总赔率:${odds_right}`;
        document.querySelector('.desktop').style.display = 'block';
    })
}

function score(){
    let base1=0
    let base2=0
    let judge1=[0,0,0,0,0,0];
    let judge2=[0,0,0,0,0,0];
    let bonus1=0
    let bonus2=0
    let double1=0
    let double2=0
    let triple1=0
    let triple2=0
    let straight1=0
    let straight2=0
    for(let i=0;i<=4;i++){
        base1+=Number(arr1[i])
        base2+=Number(arr2[i])
        judge1[Number(arr1[i])-1]++;
        judge2[Number(arr2[i])-1]++;
    }
    for(let i=0;i<=5;i++){
        if(judge1[i]===1){
            straight1++;
        }
        if(judge1[i]===2){
            double1++;
        }
        if(judge1[i]===3){
            triple1++;
        }
        // 四连
        if(judge1[i]===4){
            bonus1+=40;
            break;
        }
        // 五连
        if(judge1[i]===5){
            bonus1+=100
            break;
        }  
    }
    if(double1===1&&triple1===1){
        bonus1+=20; // 葫芦
    }
    else if(double1===2&&triple1===0){
        bonus1+=10; // 双对
    }
    else if(double1===0&&triple1===1){
        bonus1+=10; // 三连
    }
    if(straight1===5){
        if(judge1[0]===0){
            if(arr1[0]==='2'&&arr1[1]==='3'&&arr1[2]==='4'&&arr1[3]==='5'&&arr1[4]==='6'){
                bonus1+=60; // 大顺子
            }
        }
        else if(judge1[5]===0){
            if(arr1[0]==='1'&&arr1[1]==='2'&&arr1[2]==='3'&&arr1[3]==='4'&&arr1[4]==='5'){
                bonus1+=60; // 大顺子
            }
        }
        else if(judge1[1]===0){
            if(arr1[0]==='1'&&arr1[1]==='3'&&arr1[2]==='4'&&arr1[3]==='5'&&arr1[4]==='6'){
                bonus1+=30; // 小顺子
            }
        }
        else if(judge1[2]===0){
            if(arr1[0]==='1'&&arr1[1]==='2'&&arr1[2]==='4'&&arr1[3]==='5'&&arr1[4]==='6'){
                bonus1+=30; // 小顺子
            }
        }
        else if(judge1[3]===0){
            if(arr1[0]==='1'&&arr1[1]==='2'&&arr1[2]==='3'&&arr1[3]==='5'&&arr1[4]==='6'){
                bonus1+=30; // 小顺子
            }
        }
        else if(judge1[4]===0){
            if(arr1[0]==='1'&&arr1[1]==='2'&&arr1[2]==='3'&&arr1[3]==='4'&&arr1[4]==='6'){
                bonus1+=30; // 小顺子
            }
        }
    }

    for(let i=0;i<=5;i++){
        if(judge2[i]===1){
            straight2++;
        }
        if(judge2[i]===5){
            bonus2+=100
            break;
        }
        if(judge2[i]===4){
            bonus2+=40
            break;
        }
        if(judge2[i]===3){
            triple2++;
        }
        if(judge2[i]===2){
            double2++;
        }
    }
    if(double2===1&&triple2===1){
        bonus2+=20;
    }
    else if(double2===2&&triple2===0){
        bonus2+=10;
    }
    else if(double2===0&&triple2===1){
        bonus2+=10;
    }
    if(straight2===5){
        if(judge2[0]===0){
            if(arr2[0]==='2'&&arr2[1]==='3'&&arr2[2]==='4'&&arr2[3]==='5'&&arr2[4]==='6'){
                bonus2+=60; 
            }
        }
        else if(judge2[5]===0){
            if(arr2[0]==='1'&&arr2[1]==='2'&&arr2[2]==='3'&&arr2[3]==='4'&&arr2[4]==='5'){
                bonus2+=60; 
            }
        }
        else if(judge2[1]===0){
            if(arr2[0]==='1'&&arr2[1]==='3'&&arr2[2]==='4'&&arr2[3]==='5'&&arr2[4]==='6'){
                bonus2+=30; 
            }
        }
        else if(judge2[2]===0){
            if(arr2[0]==='1'&&arr2[1]==='2'&&arr2[2]==='4'&&arr2[3]==='5'&&arr2[4]==='6'){
                bonus2+=30;
            }
        }
        else if(judge2[3]===0){
            if(arr2[0]==='1'&&arr2[1]==='2'&&arr2[2]==='3'&&arr2[3]==='5'&&arr2[4]==='6'){
                bonus2+=30; 
            }
        }
        else if(judge2[4]===0){
            if(arr2[0]==='1'&&arr2[1]==='2'&&arr2[2]==='3'&&arr2[3]==='4'&&arr2[4]==='6'){
                bonus2+=30; 
            }
        }
    }
    const final1=base1+bonus1;
    const final2=base2+bonus2;
    let str=document.querySelector('.Total-odds').innerText
    let str1=document.querySelector('.chip.left').innerText
    let str2=document.querySelector('.chip.right').innerText
    const odd=Number(str.slice(4));
    chip1=Number(str1.slice(3));
    chip2=Number(str2.slice(3));
    let final;
    if(final1>final2){
        final=(final1-final2)*odd;
        chip1+=final;
        chip2-=final;
    }
    else{
        final=(final2-final1)*odd;
        chip1-=final;
        chip2+=final;
    }
    document.querySelector('.chip.left').innerText=`筹码:${chip1}`;
    document.querySelector('.chip.right').innerText=`筹码:${chip2}`;
    console.log(final1)
    console.log(final2)
    console.log(chip1)
    console.log(chip2)
}

function reset(){
    arr1=[0,0,0,0,0];
    arr2=[0,0,0,0,0];
    player1_lock=0;
    player2_lock=0;
    count1=0;
    count2=0;
    odds_right=1;
    document.querySelector('.Total-odds').innerText=`总赔率:${odds_right}`;
    for(let i=1;i<=5;i++){
        document.querySelector(`.player-area.left`).querySelector(`.dice${i}`).dataset.value=0;
        document.querySelector(`.player-area.right`).querySelector(`.dice${i}`).dataset.value=0;

        document.querySelector(`.player-area.left`).querySelector(`.dice${i}`).classList.remove('lock');
        document.querySelector(`.player-area.right`).querySelector(`.dice${i}`).classList.remove('lock');

        document.querySelector(`.player-area.left`).querySelector(`.dice${i}`).innerText='';
        document.querySelector(`.player-area.right`).querySelector(`.dice${i}`).innerText='';

        document.querySelector(`.player-area.left`).querySelector(`.lock${i}`).innerText='';
        document.querySelector(`.player-area.right`).querySelector(`.lock${i}`).innerText='';

        document.querySelector(`.player-area.left`).querySelector(`.dice${i}`).style.opacity=1;
        document.querySelector(`.player-area.right`).querySelector(`.dice${i}`).style.opacity=1;

    }
    timer1()
    timer2()
    timer3()
}

function settlement(){
    // 操作两个数组arr1,arr2，进行奖励(筹码)结算，并渲染网页，修改双方筹码和回合数
    document.querySelector('.desktop').style.display = 'none';
    document.querySelector('.odds_select').style.visibility='hidden';
    for(let i=1;i<=5;i++){
        arr1[i-1]=document.querySelector(`.player-area.left`).querySelector(`.dice${i}`).dataset.value
        arr2[i-1]=document.querySelector(`.player-area.right`).querySelector(`.dice${i}`).dataset.value
    }
    console.log(arr1)
    console.log(arr2)
    score()
    setTimeout(function(){
        reset()
        current_round++;
        document.querySelector('h1').innerText=`Round:${current_round}`;
        document.querySelector('.Rn-rounds').innerText=`剩余回合:${round-current_round}`
        document.querySelector('.desktop').style.display = 'block';
    },2000)

}

rollDice('left');
rollDice('right');
timer1()
timer2()
timer3()
const id4=setInterval(function(){
    if(current_round>round||chip1<0||chip2<0){
        clearInterval(id4)
        document.querySelector('.desktop').style.display = 'none';
        document.querySelector('.odds_select').style.visibility='hidden';
        document.querySelector('.final-chip1').innerText=`玩家一的筹码:${chip1}`
        document.querySelector('.final-chip2').innerText=`玩家二的筹码:${chip2}`
        document.querySelector('.game-over').style.visibility='visible';
    }
},100)

function returnToIndex(){
    window.location.href='../index.html'
}

import { NextResponse } from 'next/server';
const rooms = [
 {id:'64578',game:'domino',host:'Walid',players:4,maxPlayers:4,status:'playing'},
 {id:'48216',game:'ludo',host:'Ali',players:3,maxPlayers:4,status:'waiting'},
 {id:'73120',game:'chess',host:'Sara',players:2,maxPlayers:2,status:'playing'},
 {id:'59011',game:'ludo',host:'Yassine',players:2,maxPlayers:4,status:'waiting'},
];
export async function GET(){return NextResponse.json({success:true,rooms,online:true,generatedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}})}

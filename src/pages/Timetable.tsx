
const timetable = [
{
day:"Monday",
subject1:"Data Structures",
subject2:"Operating Systems",
subject3:"Computer Networks",
subject4:"DBMS"
},

{
day:"Tuesday",
subject1:"DBMS",
subject2:"Software Engineering",
subject3:"Machine Learning",
subject4:"Computer Networks"
},

{
day:"Wednesday",
subject1:"Operating Systems",
subject2:"Data Structures",
subject3:"DBMS",
subject4:"AI"
},

{
day:"Thursday",
subject1:"Computer Networks",
subject2:"Machine Learning",
subject3:"Operating Systems",
subject4:"DBMS"
},

{
day:"Friday",
subject1:"Software Engineering",
subject2:"Data Structures",
subject3:"AI",
subject4:"Project Lab"
}

]

export default function Timetable(){

return(

<div>

<h1 className="text-2xl font-bold mb-4">
Weekly Timetable
</h1>

<table className="w-full border">

<thead className="bg-blue-300">

<tr>
<th className="border p-2">Day</th>
<th className="border p-2">9-10</th>
<th className="border p-2">10-11</th>
<th className="border p-2">11-12</th>
<th className="border p-2">12-1</th>
</tr>

</thead>

<tbody>

{timetable.map((t)=>(
<tr key={t.day}>

<td className="border p-2">{t.day}</td>
<td className="border p-2">{t.subject1}</td>
<td className="border p-2">{t.subject2}</td>
<td className="border p-2">{t.subject3}</td>
<td className="border p-2">{t.subject4}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}


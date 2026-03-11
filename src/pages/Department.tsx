
import React from "react"

const departments = [
{ id:"D01", name:"Computer Science Engineering", hod:"Dr. Rajesh Kumar", students:120 },
{ id:"D02", name:"Electronics Engineering", hod:"Dr. Meena Sharma", students:95 },
{ id:"D03", name:"Mechanical Engineering", hod:"Dr. Anil Verma", students:110 },
{ id:"D04", name:"Civil Engineering", hod:"Dr. Pooja Singh", students:80 },
{ id:"D05", name:"Information Technology", hod:"Dr. Amit Gupta", students:75 }
]

export default function Departments(){

return(

<div>

<h1 className="text-2xl font-bold mb-4">
Departments
</h1>

<table className="w-full border">

<thead className="bg-red-100">

<tr>
<th className="border p-2">Department ID</th>
<th className="border p-2">Department Name</th>
<th className="border p-2">HOD</th>
<th className="border p-2">Total Students</th>
</tr>

</thead>

<tbody>

{departments.map((d)=>(
<tr key={d.id}>
<td className="border p-2">{d.id}</td>
<td className="border p-2">{d.name}</td>
<td className="border p-2">{d.hod}</td>
<td className="border p-2">{d.students}</td>
</tr>
))}

</tbody>

</table>

</div>

)

}


const person = {
    name: 'Odung',
    address: {
        line1: 'Kyungchun Street',
        city: 'Chuncheon',
        country: 'Korea'
    },
    // 배열
    profiles: ['twitter', 'linkedin', 'instagram'],
    // 함수
    printProfile: () => {
        // 하나만 출력
        console.log(person.profiles[2])
        
        // 배열을 다 출력
        person.profiles.map(
            profile => console.log(profile)            
        )
    }
}


export default function LearningJavaScript() {
    return (
        <div>
            <div>{person.name}</div>
            <div>{person.address.line1}</div>
            <div>{person.profiles[0]}</div>
            <div>{person.printProfile()}</div>
        </div>
    )
       
}
import { Reports, User } from '../Models/model.js'

export const details = async () => {
    // const usersCount=await User.countDocuments();
    // const closeComplains=await Reports.countDocuments({isOpen:true});
    // const openComplains=await Reports.countDocuments({isOpen:false});
    // const todayComplains=await Reports.countDocuments({createdAr:Date.now()})
    const res = await Reports.aggregate(
        [
            {
                $facet: {
                    "counts": [{ $group: { _id: "$isOpen", count: { $sum: 1 } } }],
                }
            }
        ]
    )
    console.log(res);

    // return {
    //     totalUsers:usersCount,
    //     closedComplains:closeComplains,
    //     openComplains:openComplains,
    //     todayComplains
    // }
}
// console.log(await details());
details()

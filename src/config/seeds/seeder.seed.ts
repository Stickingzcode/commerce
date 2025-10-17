const attachSuperRole = async () => {
    const superadmin = await User.findOne({ email: process.env.SUPERADMIN_EMAIL});
    const role = await Role.findOne({ name: UserTypeEnum.SUPER})

    if(superadmin & role) {
        const hasRole = await superadmin.hasRole(UserTypeEnum.SUPER, superadmin.roles)

        if(!hasRole) {
            superadmin.roles.push(role._id);
            await superadmin.save();

            role.users.push(superadmin._id);
            await role.save();

            console.log(colors.magenta.inverse('Superadmin role attached successfully'));
        }
    }
}

const seedData = async () => {
    await seedRoles();
    await seedUsers();

    await attachSuperRole();
}

export default seedData;
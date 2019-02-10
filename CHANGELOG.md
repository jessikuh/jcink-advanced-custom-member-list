# Changelog

All potentially site breaking or any noteworthy changes can be found here.

## Unreleased

## Released

### [1.1] - 2019.02.10

- If JcInk global variable input_act is used within a class, when on /index.php?act=Members, 'Members' is added to the element. Since the code appends users to a container of '.members', interference was occurring, causing members to append to the wrong members element. In order to resolve this, 'members' has been changed to 'custom-members'. In the instructions, .members is referenced for CSS purposes and therefore, it is **recommended to update** any use of '.members' in your CSS to '.custom-members'.

### [1.0.01] - 2019.02.10

- Removed index.php from URL references for those who prefer not to include index.php in their member list URL.

### [1.0.0] - 2019.02.01

- Version 1 released.
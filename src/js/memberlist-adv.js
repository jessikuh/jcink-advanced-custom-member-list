const submitSearchField = () => {
  document.querySelector('form.members-form').submit();
},
memberList = () => {
  const root = document.querySelector('#member-list'),
        searchUrl = `${location.protocol}//${location.host}/index.php?act=Members&s=`,
        searchField = document.createElement('div'),
        // Define the URL structure for a member's profile
        memberUrl = `${location.protocol}//${location.host}/index.php?showuser=`,
        memberListElement = document.createElement('div'),
        membersElement = document.createElement('div'),
        searchGroupOptions = Array.prototype.slice.call(document.querySelectorAll('select[name="filter"] option')),
        searchGroupSelect = document.createElement('div'),
        searchGroupLinks = document.createElement('div'),
        clearSearch = document.createElement('div'),
        searchInput = document.querySelector('.member-search-input input[name="name"]'),
        Members = [],
        getNames = Array.prototype.slice.call(root.querySelectorAll('td.name'));

  // Hide the member list table
  root.style.display = 'none';

  // Create a new container for the members to live in
  memberListElement.className = 'member-list';
  membersElement.innerHTML = '<div class="custom-members"></div>';

  searchField.innerHTML = '<div class="member-search-input"><input type="text" size="25" name="name" value="" placeholder="Search"></div>';

  searchGroupSelect.innerHTML = '<div class="member-select-groups"><select class="member-search-select" onchange="submitSearchField()" name="filter"></select></div>';

  searchGroupLinks.innerHTML = '<div class="member-search-links"></div>';

  const searchGroupSelectElement = searchGroupSelect.querySelector('select');
  searchGroupOptions.forEach((option) => {
    const newOption = document.createElement('option'),
          newLink = document.createElement('a');

    newOption.value = option.value;
    newOption.id = option.text.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
    newOption.text = option.text;
    searchGroupSelectElement.appendChild(newOption);

    newLink.className = 'member-search-link';
    newLink.setAttribute('data-value', option.value);
    newLink.href = '#';
    newLink.text = option.text;
    newLink.id = option.text.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
    searchGroupLinks.querySelector('.member-search-links').appendChild(newLink);
  });

  clearSearch.innerHTML = '<div class="clear-search"><a href="/index.php?act=Members">Clear Search</a>';

  const elementReplacements = {
          '{{clear-search}}': clearSearch.innerHTML,
          '{{members}}': membersElement.innerHTML,
          '{{search-input}}': searchField.innerHTML,
          '{{search-links}}': searchGroupLinks.innerHTML,
          '{{search-select}}': searchGroupSelect.innerHTML
        },
        elementReplaceValues = new RegExp(Object.keys(elementReplacements).join('|'), 'gi');

  memberListElement.innerHTML += `<form class="members-form" action="${searchUrl}" method="post">${customMemberListWrapper.replace(elementReplaceValues, (matched) => {
    return elementReplacements[matched];
  })}</form>`;
  root.parentNode.insertBefore(memberListElement, root.nextSibling);

  if (searchInput) {
    searchInput.addEventListener('keyup', () => {
      if (event.keyCode === 13) {
        document.querySelector('form.members-form').submit();
      }
    });
  }

  const searchGroupLink = Array.prototype.slice.call(document.querySelectorAll('.member-search-links a'));

  searchGroupLink.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const value = link.getAttribute('data-value'),
            hiddenInput = document.createElement('input');

      hiddenInput.type = 'hidden';
      hiddenInput.name = 'filter';
      hiddenInput.value = value;
      document.querySelector('form.members-form').appendChild(hiddenInput);
      document.querySelector('form.members-form').submit();
    });
  });

  function Member(name, id, level, group, joined, posts) {
    this.name = name;
    this.id = id;
    this.level = level;
    this.group = group;
    this.joined = joined;
    this.posts = posts;
  }

  // Retrieve all members' information
  getNames.forEach((memberInfo) => {
    const name = memberInfo.textContent,
          link = memberInfo.querySelector('a').getAttribute('href'),
          id = link.substring(link.lastIndexOf('=')).replace('=', ''),
          level = memberInfo.parentNode.querySelector('td.level').innerHTML,
          group = memberInfo.parentNode.querySelector('td.group').textContent,
          joined = memberInfo.parentNode.querySelector('td.joined').textContent,
          posts = memberInfo.parentNode.querySelector('td.posts').textContent;

    Members.push(new Member(name, id, level, group, joined, posts));
  });

  // Loop through each member
  Members.forEach((member) => {
    fetch(memberUrl + member.id)
      .then((response) => {
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser(),
              data = parser.parseFromString(html, 'text/html'),
              customFields = data.querySelectorAll('[id*="memberList"]'),
              memberObj = {
                '{{group}}': member.group,
                '{{joined}}': member.joined,
                '{{level}}': member.level,
                '{{name}}': member.name,
                '{{posts}}': member.posts,
                '{{member-url}}': `<a class="member-link" href="${memberUrl}${member.id}">`,
                '{{/member-url}}': '</a>'
              };

        customFields.forEach((field) => {
          const findVar = field.id.indexOf('-');
          let customVar = field.id.substr(findVar + 1),
              customVarData = data.querySelector('#memberList-' + customVar).innerHTML;

          if (customVarData.indexOf('script') > -1) {
            let defaultVar = customVarData.substring(
              customVarData.indexOf('{'),
              customVarData.indexOf(';')
            );

            if (defaultVar.indexOf('img') > -1) {
              defaultVar = defaultVar.substring(
                defaultVar.indexOf('"') + 1,
                defaultVar.lastIndexOf('"')
              );
            } else if (defaultVar.indexOf('document.write') > -1) {
              defaultVar = defaultVar.substring(
                defaultVar.indexOf("'") + 1,
                defaultVar.lastIndexOf("'")
              );
            }

            customVarData = customVarData.substring(
              customVarData.indexOf("'") + 1,
              customVarData.indexOf('=') - 2
            );
            if (customVarData.indexOf('No Information') > -1) {
              customVarData = defaultVar;
            }
          }

          customVarData = customVarData.indexOf('No Information') > -1 ? '' : customVarData;
          memberObj[`{{${customVar}}}`] = customVarData;
        });

        const memberReplaceValues = new RegExp(Object.keys(memberObj).join('|'), 'gi'),
              userDiv = document.createElement('div'),
              groupId = member.group.toLowerCase().replace(/ /g, '-').replace(/'/g, '');

        // Append group to div to allow styling based on member's group
        userDiv.id = groupId;
        userDiv.className = 'member-container';

        // Wrap member's profile URL around all code
        userDiv.innerHTML += `${customMemberList.replace(memberReplaceValues, (matched) => {
          return memberObj[matched];
        })}`; // replace customized vars with data
        document.querySelector('.custom-members').appendChild(userDiv);
      });
  });
};

if (window.location.href.indexOf('?act=Members') > -1 || window.location.href.indexOf('?&act=Members') > -1) {
  memberList();
  document.querySelector('form.members-form').className = 'members-form';
}

if (window.location.href.indexOf('?act=Members&s=') > -1) {
  document.querySelector('form.members-form').className += ' member-search-applied';
}
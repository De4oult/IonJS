const vdomExample = {
    tag: 'div',
    props: {
        class: 'container',
    },
    children: [
        {
            tag: 'h1',
            props: {
                title: 'This is a title',
            },
            children : 'Basic text'
        },
        {
            tag: 'p',
            props: {
                class: 'description',
            },
            children : 'Lorem ipsum dolor sit amet'
        },
    ],
}

// Creating virtual node
function Node(tag, props, children) {
    return {
        tag, 
        props, 
        children
    }   
}

// Mounting virtual node to the DOM
function mount(vnode, container) {
    const element = document.createElement(vnode.tag)

    for(const key in vnode.props) {
        element.setAttribute(key, vnode.props[key])
    }

    if(typeof vnode.children === 'string') {
        element.textContent = vnode.children
    }
    else {
        vnode.children.forEach(child => {
            mount(child, element)
        });
    }

    container.appendChild(element)

    vnode.$element = element
}

// Unmouting vnode from the DOM
function unmount(vnode) {
    vnode.$element.parentNode.removeChild(vnode.$element)
} 

// Taking two nodes and comparing them
function patch(node1, node2) {
    // Different tags
    if(node1.tag !== node2.tag) {
        mount(node2, node1.$element.parentNode)
        unmount(node1)
    }
    else {
        node2.$element = node1.$element
    
        if(typeof node2.children === 'string') node2.$element.textContent = node2.children;
        else {
            while(node2.$element.attributes.length > 0) node2.$element.removeAttribute(node2.$element.attributes[0].name)
            
            for(const key in node2.props) node2.$element.setAttribute(key, node2.props[key])
            
            if(typeof node1.children === 'string') {
                node2.$element.textContent = null
                node2.children.forEach(child => {
                    mount(child, node2.$element)
                });
            }
            else {
                const commonLength = Math.min(node1.children.length, node2.children.length)
                
                for(let i = 0; i < commonLength; i++) patch(node1.children[i], node2.children[i])

                if(node1.children.length > node2.children.length) { 
                    node1.children.slice(node2.children.length).forEach(child => {
                        unmount(child)
                    });
                }
                else if(node2.children.length > node1.children.length) {
                    node2.children.slice(node1.children.length).forEach(child => {
                        mount(child)
                    });
                }
            }
        }
    }
}
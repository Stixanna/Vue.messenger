export function requestNotifications() {
    try{
        let notificationAPI = Notification;
        if (notificationAPI && !!notificationAPI.permission) {
            notificationAPI.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    // Permission granted, now you can show notifications
                    console.log('Notification permission granted.');
                    // showMyNotification(); // Call a function to show the notification
                } else if (permission === 'denied') {
                    // Permission denied
                    console.log('Notification permission denied.');
                } else {
                    // Permission not yet granted (e.g., 'default' state)
                    console.log('Notification permission not yet decided.');
                }
            });
        }
        return;
    }
    catch(e){
        console.error('Not requested notify: ', e)
        return;
    }
}

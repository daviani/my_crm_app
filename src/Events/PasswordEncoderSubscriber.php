<?php
    
    namespace App\Events;
    
    use Symfony\Component\EventDispatcher\EventSubscriberInterface;
    use Symfony\Component\HttpKernel\KernelEvents;
    use ApiPlatform\Core\EventListener\EventPriorities;
    use Symfony\Component\HttpKernel\Event\ViewEvent;
    use App\Entity\User;
    use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
    
    class PasswordEncoderSubscriber implements EventSubscriberInterface {
    
        /**
         * @var \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface
         */
        private $encoder;
        
        public function __construct(UserPasswordEncoderInterface $encoder) {
            $this->encoder = $encoder;
        }
        
    
        public static function getSubscribedEvents() {
            return [
                KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
            ];
        }
        
        public function encodePassword(ViewEvent $event) {
            $result = $event->getControllerResult();
            $method = $event->getRequest()->getMethod();
            
            if($result instanceof User && $method === 'POST') {
                $hash = $this->encoder->encodePassword($result, $result->getPassword());
                $result->setPassword($hash);
            }
        }
    }

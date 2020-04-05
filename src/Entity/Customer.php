<?php

    namespace App\Entity;

    use ApiPlatform\Core\Annotation\ApiFilter;
    use ApiPlatform\Core\Annotation\ApiResource;
    use ApiPlatform\Core\Annotation\ApiSubresource;
    use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
    use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
    use Doctrine\Common\Collections\ArrayCollection;
    use Doctrine\Common\Collections\Collection;
    use Doctrine\ORM\Mapping as ORM;
    use Symfony\Component\Serializer\Annotation\Groups;
    use Symfony\Component\Validator\Constraints as Assert;

    /**
     * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
     * @ApiResource(
     *  collectionOperations={"GET", "POST"},
     *  itemOperations={"GET", "PUT", "DELETE"},
     *  subresourceOperations={
     *      "invoices_get_subresource"={"path"="/customers/{id}/invoices"}
     *  },
     *  normalizationContext={
     *      "groups"={"customers_read"}
     *  }
     * )
     * @ApiFilter(SearchFilter::class)
     * @ApiFilter(OrderFilter::class)
     */
    class Customer {
        /**
         * @ORM\Id()
         * @ORM\GeneratedValue()
         * @ORM\Column(type="integer")
         * @Groups({"customers_read", "invoices_read"})
         */
        private $id;

        /**
         * @ORM\Column(type="string", length=255)
         * @Groups({"customers_read", "invoices_read"})
         * @Assert\NotBlank(message="Veuillez saisir votre prénom")
         * @assert\Length(min=3, minMessage="Veuillez saisir au minimum 3 caractère",
         *               max=255, maxMessage="Veuillez saisir au maximum 255 caractère")
         */
        private $firstName;

        /**
         * @ORM\Column(type="string", length=255)
         * @Groups({"customers_read", "invoices_read"})
         * @Assert\NotBlank(message="Veuillez saisir votre nom")
         * @assert\Length(min=3, minMessage="Veuillez saisir au minimum 3 caractère",
         *                       max=255,  maxMessage="Veuillez saisir au maximum 255 caractère")
         */
        private $lastName;

        /**
         * @ORM\Column(type="string", length=255)
         * @Groups({"customers_read", "invoices_read"})
         * @Assert\NotBlank(message="Veuillez saisir votre email")
         * @Assert\Email(message="Veuillez saisir une adresse email valide")
         */
        private $email;

        /**
         * @ORM\Column(type="string", length=255, nullable=true)
         * @Groups({"customers_read", "invoices_read"})
         */
        private $company;

        /**
         * @ORM\OneToMany(targetEntity="App\Entity\Invoice", mappedBy="customer")
         * @Groups({"customers_read"})
         * @ApiSubresource
         */
        private $invoices;

        /**
         * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customers")
         * @Groups({"customers_read"})
         * @Assert\NotBlank(message="L'utilisateur est obligatoire")
         */
        private $user;

        public function __construct () {
            $this -> invoices = new ArrayCollection();
        }

        /** Recupère le total des invoices
         * @Groups({"customers_read"})
         *
         * @return float
         */
        public function getTotalAmount ()
        : float {
            return array_reduce (
                $this -> invoices -> toArray (), static function ( $total,
                                                                   $invoice ) {
                return $total + $invoice -> getAmount ();
            }, 0 );
        }

        /** Recupère le total des invoices unpaid
         * @Groups({"customers_read"})
         *
         * @return float
         */
        public function getUnpaidAmount ()
        : float {
            return array_reduce (
                $this -> invoices -> toArray (), static function ( $total,
                                                                   $invoice ) {
                return $total + ($invoice -> getStatus () === 'PAID' || $invoice -> getStatus () === 'CANCELLED' ? 0 :
                        $invoice -> getAmount ());
            }, 0 );
        }

        public function getId ()
        : ?int {
            return $this -> id;
        }

        public function getFirstName ()
        : ?string {
            return $this -> firstName;
        }

        public function setFirstName ( string $firstName )
        : self {
            $this -> firstName = $firstName;

            return $this;
        }

        public function getLastName ()
        : ?string {
            return $this -> lastName;
        }

        public function setLastName ( string $lastName )
        : self {
            $this -> lastName = $lastName;

            return $this;
        }

        public function getEmail ()
        : ?string {
            return $this -> email;
        }

        public function setEmail ( string $email )
        : self {
            $this -> email = $email;

            return $this;
        }

        public function getCompany ()
        : ?string {
            return $this -> company;
        }

        public function setCompany ( ?string $company )
        : self {
            $this -> company = $company;

            return $this;
        }

        /**
         * @return Collection|Invoice[]
         */
        public function getInvoices ()
        : Collection {
            return $this -> invoices;
        }

        public function addInvoice ( Invoice $invoice )
        : self {
            if (!$this -> invoices -> contains ( $invoice )) {
                $this -> invoices[] = $invoice;
                $invoice -> setCustomer ( $this );
            }

            return $this;
        }

        public function removeInvoice ( Invoice $invoice )
        : self {
            if ($this -> invoices -> contains ( $invoice )) {
                $this -> invoices -> removeElement ( $invoice );
                // set the owning side to null (unless already changed)
                if ($invoice -> getCustomer () === $this) {
                    $invoice -> setCustomer ( null );
                }
            }

            return $this;
        }

        public function getUser ()
        : ?User {
            return $this -> user;
        }

        public function setUser ( ?User $user )
        : self {
            $this -> user = $user;

            return $this;
        }
    }

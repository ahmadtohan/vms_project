package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.top.vms.annotations.AfterInsert;
import com.top.vms.annotations.AfterUpdate;
import com.top.vms.annotations.BeforeDelete;
import com.top.vms.configuration.Setup;
import com.top.vms.repository.AttachmentRepository;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.persistence.Version;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

/**
 *
 *
 * Created on Jun 20, 2017
 */
@MappedSuperclass
public abstract class BaseEntity extends BaseEntityParent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @Version
    @ColumnDefault("0")
    @Column
    private long version;

    @JsonIgnore
    @Column(name = "CREATION_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date creationDate = new Date();

    @Transient
    private List<Attachment> attachments;

    @AfterUpdate
    @AfterInsert
    public void updateAttachmentsAfterSave(){
        if (!this.getAttachments().isEmpty()) {
            for (Attachment attachment : this.getAttachments()) {
                attachment.setEntityId(this.getId());
                attachment.setEntityType(this.getClass().getSimpleName());
            }

            this.setAttachments(Setup.getApplicationContext().getBean(AttachmentRepository.class).saveAll(this.getAttachments()));
        }
    }

    @BeforeDelete
    public void removeAttachmentsBeforeDelete(){
        List<Attachment> attachments=Setup.getApplicationContext().getBean(AttachmentRepository.class).findByEntityIdAndEntityType(this.getId(),this.getClass().getSimpleName());
        if (!attachments.isEmpty()) {
            Setup.getApplicationContext().getBean(AttachmentRepository.class).deleteAll(attachments);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {

        this.attachments = attachments;
    }

    public List<Attachment> loadAttachments() {

        this.setAttachments(Setup.getApplicationContext().getBean(AttachmentRepository.class).findByEntityIdAndEntityType(this.getId(), this.getClass().getSimpleName()));
        return this.attachments;
    }

}
